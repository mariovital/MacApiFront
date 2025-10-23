package mx.tec.prototipo_01.ui.screens

import android.content.Context
import android.location.Geocoder
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.navigation.NavController
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import java.io.IOException
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale
import org.json.JSONArray
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.supervisorScope
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import android.os.SystemClock
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel
import mx.tec.prototipo_01.models.TicketStatus
import mx.tec.prototipo_01.models.api.TechnicianDto

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MesaTicketDetailsReadOnly(
    navController: NavController,
    viewModel: MesaAyudaSharedViewModel,
    ticketId: String
) {
    val decodedId = remember(ticketId) { URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString()) }

    LaunchedEffect(decodedId) {
        viewModel.refreshTicketDetail(decodedId)
    }

    val ticket = viewModel.getTicketById(decodedId)
    val context = LocalContext.current
    val rawLocation = ticket?.location ?: "—"
    val cleanAddress = remember(rawLocation) { sanitizeAddress(rawLocation) }

    val view = LocalView.current
    val isDark = isSystemInDarkTheme()
    val topBarColor = MaterialTheme.colorScheme.primary
    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = topBarColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !isDark
    }

    val isAssigning = viewModel.assigningTicketNumber == decodedId

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Detalles del Ticket", fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onPrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(MaterialTheme.colorScheme.error, CircleShape)
                        )
                    }
                },
                navigationIcon = {
                    val lastBackClick = remember { mutableStateOf(0L) }
                    IconButton(onClick = {
                        val now = SystemClock.elapsedRealtime()
                        if (now - lastBackClick.value > 700) {
                            lastBackClick.value = now
                            navController.navigateUp()
                        }
                    }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver atrás", tint = MaterialTheme.colorScheme.onPrimary)
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = topBarColor)
            )
        }
    ) { padding ->
        val currentTicket = ticket
        if (currentTicket == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
            return@Scaffold
        }

        val locationResult by produceState<LocationResult>(
            initialValue = if (cleanAddress.isBlank()) LocationResult.Empty else LocationResult.Loading,
            key1 = currentTicket.id,
            key2 = cleanAddress
        ) {
            if (cleanAddress.isBlank() || cleanAddress == "—") {
                value = LocationResult.Empty
                return@produceState
            }
            value = LocationResult.Loading
            value = try {
                withContext(Dispatchers.IO) {
                    val coords = geocodeAddressFastMesa(context, cleanAddress)
                        ?: geocodeAddressFastMesa(context, "$cleanAddress, Mexico")?.also {
                            GeocodeCacheMesa[cleanAddress] = it
                        }
                    if (coords != null) LocationResult.Success(coords) else LocationResult.NotFound
                }
            } catch (e: Exception) {
                LocationResult.Error(e.localizedMessage ?: "No se pudo ubicar la direccion.")
            }
        }

    // Tomar un snapshot local para permitir smart casts con delegated properties
    val lrSnapshot = locationResult
    val mapCoordinates = (lrSnapshot as? LocationResult.Success)?.latLng

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Person, "Usuario", tint = Color.LightGray, modifier = Modifier.size(24.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                StatusBadgeChip(status = currentTicket.status.displayName)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = currentTicket.id,
                                    fontSize = 12.sp,
                                    color = Color.Gray,
                                    modifier = Modifier
                                        .background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                PriorityBadgeChip(priority = currentTicket.priority)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.DateRange, "Ticket Title", modifier = Modifier.padding(top = 4.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(currentTicket.title, fontWeight = FontWeight.Bold, fontSize = 22.sp)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("·", color = Color.Gray, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(currentTicket.company, color = Color.Gray, fontSize = 14.sp)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(verticalAlignment = Alignment.Top) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(top = 8.dp)) {
                                Box(modifier = Modifier.width(1.dp).height(4.dp).background(Color.LightGray))
                                Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color.LightGray))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            val descripcionLimpia = remember(currentTicket.description) { cleanDescription(currentTicket.description) }
                            Text(descripcionLimpia, style = MaterialTheme.typography.bodyLarge, lineHeight = 24.sp, color = Color.Gray)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Detalles:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            if (currentTicket.status == mx.tec.prototipo_01.models.TicketStatus.RECHAZADO && !currentTicket.rejectionReason.isNullOrBlank()) {
                                Text("Motivo del rechazo:", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    currentTicket.rejectionReason!!,
                                    color = MaterialTheme.colorScheme.error,
                                    fontSize = 14.sp,
                                    lineHeight = 20.sp
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                            }
                            if (!currentTicket.categoryName.isNullOrBlank()) {
                                Text("Categoría: ${currentTicket.categoryName}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!currentTicket.clientDepartment.isNullOrBlank()) {
                                Text("Departamento: ${currentTicket.clientDepartment}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!currentTicket.clientEmail.isNullOrBlank()) {
                                Text("Email: ${currentTicket.clientEmail}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!currentTicket.clientPhone.isNullOrBlank()) {
                                Text("Teléfono: ${currentTicket.clientPhone}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!currentTicket.priorityJustification.isNullOrBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Justificación de prioridad:", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(currentTicket.priorityJustification!!, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Ubicacion:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(cleanAddress, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Siempre renderizar el mapa: centrado en un target por defecto y animar cuando haya coordenadas.
                        val defaultTarget = remember { LatLng(19.4056, -99.0965) }
                        val cameraPositionState = rememberCameraPositionState {
                            position = CameraPosition.fromLatLngZoom(defaultTarget, 15f)
                        }
                        LaunchedEffect(lrSnapshot) {
                            val success = lrSnapshot as? LocationResult.Success
                            success?.let { s ->
                                cameraPositionState.animate(
                                    CameraUpdateFactory.newLatLngZoom(s.latLng, 15f)
                                )
                            }
                        }
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                                .clip(RoundedCornerShape(12.dp))
                        ) {
                            GoogleMap(
                                modifier = Modifier.matchParentSize(),
                                cameraPositionState = cameraPositionState
                            ) {
                                val success = lrSnapshot as? LocationResult.Success
                                success?.let { s ->
                                    Marker(state = MarkerState(position = s.latLng), title = "Ubicacion del ticket")
                                }
                            }

                            if (lrSnapshot is LocationResult.Loading) {
                                Box(Modifier.matchParentSize().background(Color(0x12000000)), contentAlignment = Alignment.Center) {
                                    CircularProgressIndicator()
                                }
                            }
                        }

                        when (lrSnapshot) {
                            LocationResult.Empty -> Text("Sin ubicacion registrada.", color = Color.Gray, fontSize = 12.sp)
                            LocationResult.NotFound -> Text("No se pudo ubicar la direccion en el mapa.", color = Color.Gray, fontSize = 12.sp)
                            is LocationResult.Error -> Text(lrSnapshot.message, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                            else -> {}
                        }

                        // Boton para ver evidencias (comentarios y adjuntos) como lo hace tecnico
                        Spacer(modifier = Modifier.height(16.dp))
                        OutlinedButton(
                            onClick = {
                                val encoded = java.net.URLEncoder.encode(currentTicket.id, java.nio.charset.StandardCharsets.UTF_8.toString())
                                navController.navigate("mesa_ticket_attachments/$encoded/${currentTicket.title.encodeUrl()}/${currentTicket.company.encodeUrl()}/${currentTicket.assignedTo.encodeUrl()}/${currentTicket.status.displayName.encodeUrl()}/${currentTicket.priority.encodeUrl()}")
                            },
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Ver evidencias")
                        }

                        if (currentTicket.status == TicketStatus.RECHAZADO) {
                            Spacer(modifier = Modifier.height(24.dp))
                            Text("Reasignar a tecnico:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))

                            // Cargar catalogo de tecnicos desde el ViewModel
                            LaunchedEffect(Unit) {
                                viewModel.loadTechnicians()
                            }
                            val technicians = viewModel.technicians
                            val isLoadingTechs = viewModel.isLoadingTechnicians
                            val techsError = viewModel.techniciansError
                            var selectedTech by remember { mutableStateOf<TechnicianDto?>(null) }
                            var expanded by remember { mutableStateOf(false) }

                            ExposedDropdownMenuBox(
                                expanded = expanded,
                                onExpandedChange = { expanded = it }
                            ) {
                                OutlinedTextField(
                                    value = selectedTech?.let { listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" } } ?: "",
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Selecciona tecnico") },
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                                    modifier = Modifier
                                        .menuAnchor()
                                        .fillMaxWidth()
                                )
                                ExposedDropdownMenu(
                                    expanded = expanded,
                                    onDismissRequest = { expanded = false }
                                ) {
                                    technicians.forEach { tech ->
                                        val label = listOfNotNull(tech.first_name, tech.last_name).joinToString(" ").ifBlank { tech.username ?: "" }
                                        DropdownMenuItem(text = { Text(label) }, onClick = {
                                            selectedTech = tech
                                            expanded = false
                                        })
                                    }
                                }
                            }

                            if (isLoadingTechs) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Cargando tecnicos...")
                                }
                            }
                            if (techsError != null && technicians.isEmpty()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(techsError, color = MaterialTheme.colorScheme.error)
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                            Button(
                                onClick = {
                                    val techId = selectedTech?.id
                                    if (techId != null) {
                                        viewModel.assignTicket(currentTicket.id, techId) { success ->
                                            Toast.makeText(
                                                context,
                                                if (success) "Ticket reasignado" else "No se pudo reasignar el ticket",
                                                Toast.LENGTH_SHORT
                                            ).show()
                                            if (success) {
                                                navController.popBackStack()
                                            }
                                        }
                                    } else {
                                        Toast.makeText(context, "Selecciona un tecnico", Toast.LENGTH_SHORT).show()
                                    }
                                },
                                enabled = !isAssigning && !isLoadingTechs && technicians.isNotEmpty(),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                if (isAssigning) {
                                    CircularProgressIndicator(
                                        modifier = Modifier
                                            .size(16.dp)
                                            .padding(end = 8.dp),
                                        strokeWidth = 2.dp,
                                        color = MaterialTheme.colorScheme.onSecondary
                                    )
                                }
                                Text("Reasignar")
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun sanitizeAddress(address: String): String {
    if (address.isBlank()) return address
    return address.trim()
        .removePrefix("Ubicacion:")
        .removePrefix("Ubicación:")
        .removePrefix("Location:")
        .trim()
        .replace(Regex("[\n\r]+"), " ")
        .replace("  ", " ")
}

private suspend fun geocodeAddressFastMesa(context: Context, address: String): LatLng? {
    val normalized = address.trim()
    GeocodeCacheMesa[normalized]?.let { return it }
    return supervisorScope {
        val deviceJob = async(Dispatchers.IO) { deviceGeocodeMesa(context, normalized) }
        val webJob = async(Dispatchers.IO) { webGeocodeMesa(normalized) }
        val deviceFirst = withTimeoutOrNull(1800) { deviceJob.await() }
        var result = deviceFirst ?: withTimeoutOrNull(2500) { webJob.await() }
        if (!deviceJob.isCompleted) deviceJob.cancel()
        if (!webJob.isCompleted) webJob.cancel()

        if (result == null) {
            val alt = "$normalized, México"
            val altDevice = withTimeoutOrNull(1200) { deviceGeocodeMesa(context, alt) }
            result = altDevice ?: withTimeoutOrNull(2000) { webGeocodeMesa(alt) }
        }

        result?.also { GeocodeCacheMesa[normalized] = it }
        result
    }
}

private fun deviceGeocodeMesa(context: Context, address: String): LatLng? = try {
    val geocoder = Geocoder(context, Locale("es", "MX"))
    @Suppress("DEPRECATION")
    val addresses = geocoder.getFromLocationName(address, 1)
    if (addresses?.isNotEmpty() == true) LatLng(addresses[0].latitude, addresses[0].longitude) else null
} catch (_: Exception) { null }

private fun webGeocodeMesa(address: String): LatLng? = try {
    val url = URL("https://nominatim.openstreetmap.org/search?q=${URLEncoder.encode(address, "UTF-8")}&format=json&limit=1&addressdetails=0&countrycodes=mx")
    val connection = (url.openConnection() as HttpURLConnection).apply {
        requestMethod = "GET"
        setRequestProperty("User-Agent", "MAC-Tickets/1.0 (android-app)")
        setRequestProperty("Accept-Language", "es-MX,es;q=0.9")
        connectTimeout = 3500
        readTimeout = 3500
    }
    val response = connection.inputStream.bufferedReader().use { it.readText() }
    val jsonArray = JSONArray(response)
    if (jsonArray.length() > 0) {
        val obj = jsonArray.getJSONObject(0)
        val lat = obj.optString("lat").toDoubleOrNull()
        val lon = obj.optString("lon").toDoubleOrNull()
        if (lat != null && lon != null) LatLng(lat, lon) else null
    } else null
} catch (_: Exception) { null }

private object GeocodeCacheMesa {
    private val map = LinkedHashMap<String, LatLng>(64, 0.75f, true)
    private const val MAX = 100
    operator fun get(key: String): LatLng? = synchronized(map) { map[key] }
    operator fun set(key: String, value: LatLng) {
        synchronized(map) {
            map[key] = value
            if (map.size > MAX) {
                val firstKey = map.entries.firstOrNull()?.key
                if (firstKey != null) map.remove(firstKey)
            }
        }
    }
}

private fun cleanDescription(description: String): String {
    return description
        .lines()
        .filterNot { line ->
            val normalized = line.trim().replaceFirst("^[-•\\s]+".toRegex(), "")
            normalized.equals("Hardware:", ignoreCase = true) ||
                    normalized.startsWith("Dispositivo:", ignoreCase = true) ||
                    normalized.startsWith("S/N:", ignoreCase = true) ||
                    normalized.startsWith("Serie:", ignoreCase = true) ||
                    normalized.startsWith("Serial:", ignoreCase = true)
        }
        .joinToString("\n")
        .replace("\n\n\n", "\n\n")
        .trim()
}

// Extensión local para codificar segmentos de URL
private fun String.encodeUrl(): String = URLEncoder.encode(this, StandardCharsets.UTF_8.toString())

private sealed interface LocationResult {
    object Loading : LocationResult
    object Empty : LocationResult
    object NotFound : LocationResult
    data class Success(val latLng: LatLng) : LocationResult
    data class Error(val message: String) : LocationResult
}
