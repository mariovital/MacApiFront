package mx.tec.prototipo_01.ui.screens

import android.content.Context
import android.location.Geocoder
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
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import android.content.Intent
import android.net.Uri
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.models.TicketStatus
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale
import org.json.JSONArray
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withTimeoutOrNull
import android.os.SystemClock

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TecnicoTicketDetails(
    navController: NavController,
    viewModel: TecnicoSharedViewModel,
    ticketId: String
) {
    // Get the ticket from the ViewModel. This is reactive and will update if the ticket changes.
    val ticket = remember(ticketId) { viewModel.getTicketById(URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString())) }
    var showCloseConfirmationDialog by remember { mutableStateOf(false) }
    var showRejectDialog by remember { mutableStateOf(false) }
    var rejectReason by remember { mutableStateOf("") }

    // Intentar refrescar detalle desde backend cuando se abre la pantalla
    LaunchedEffect(ticketId) {
        viewModel.refreshTicketDetail(URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString()))
    }

    // If the ticket is null for any reason (e.g., it was rejected and removed), just go back.
    if (ticket == null) {
        navController.popBackStack()
        return
    }

    if (showCloseConfirmationDialog) {
        AlertDialog(
            onDismissRequest = { showCloseConfirmationDialog = false },
            title = { Text("Confirmar Cierre") },
            text = { Text("¿Estás seguro de que quieres cerrar este ticket?") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.closeTicket(ticket.id)
                        showCloseConfirmationDialog = false
                        navController.popBackStack()
                    }
                ) {
                    Text("Confirmar")
                }
            },
            dismissButton = {
                Button(onClick = { showCloseConfirmationDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }

    if (showRejectDialog) {
        AlertDialog(
            onDismissRequest = { showRejectDialog = false },
            title = { Text("Rechazar ticket") },
            text = {
                Column {
                    Text("Por favor describe el motivo del rechazo:")
                    Spacer(modifier = Modifier.height(8.dp))
                    androidx.compose.material3.OutlinedTextField(
                        value = rejectReason,
                        onValueChange = { rejectReason = it },
                        singleLine = false,
                        minLines = 3,
                        maxLines = 5,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(onClick = {
                    viewModel.rejectTicket(ticket.id, rejectReason.ifBlank { null })
                    showRejectDialog = false
                    navController.popBackStack()
                }) { Text("Enviar y rechazar") }
            },
            dismissButton = {
                Button(onClick = { showRejectDialog = false }) { Text("Cancelar") }
            }
        )
    }

    val (dispositivo, serialNumber) = remember(ticket.description) { parseHardwareFromDescription(ticket.description) }
    val problema = ticket.title
    val ubicacion = ticket.location ?: "—"
    val cleanAddress = remember(ubicacion) { sanitizeAddress(ubicacion) }
    val context = LocalContext.current
    var mapCoordinates by remember(ubicacion) { mutableStateOf<LatLng?>(null) }
    var geocodeTried by remember(ubicacion) { mutableStateOf(false) }
    var geocodeFailed by remember(ubicacion) { mutableStateOf(false) }

    // Geocodificar con estrategia rápida: caché + carreras en paralelo (device + web) con timeouts cortos
    LaunchedEffect(cleanAddress) {
        if (cleanAddress.isNotBlank() && cleanAddress != "—") {
            mapCoordinates = geocodeAddressFast(context, cleanAddress)
            geocodeTried = true
            geocodeFailed = mapCoordinates == null
        } else {
            mapCoordinates = null
            geocodeTried = true
            geocodeFailed = true
        }
    }

    val view = LocalView.current
    val isDark = isSystemInDarkTheme()
    val topBarColor = MaterialTheme.colorScheme.primary
    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = topBarColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !isDark
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Detalles del Ticket", fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onPrimary) },
                navigationIcon = {
                    val lastBackClick = remember { mutableStateOf(0L) }
                    IconButton(onClick = {
                        val now = SystemClock.elapsedRealtime()
                        if (now - lastBackClick.value > 700) {
                            lastBackClick.value = now
                            // Usa navigateUp para no hacer pop extra cuando ya no hay back stack
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
                                StatusBadge(status = ticket.status.displayName)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = ticket.id,
                                    fontSize = 12.sp,
                                    color = Color.Gray,
                                    modifier = Modifier
                                        .background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                PriorityBadge(priority = ticket.priority)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.DateRange, "Ticket Title", modifier = Modifier.padding(top = 4.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(ticket.title, fontWeight = FontWeight.Bold, fontSize = 22.sp)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("·", color = Color.Gray, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(ticket.company, color = Color.Gray, fontSize = 14.sp)
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
                                val descripcionLimpia = remember(ticket.description) { cleanDescription(ticket.description) }
                                Text(descripcionLimpia, style = MaterialTheme.typography.bodyLarge, lineHeight = 24.sp, color = Color.Gray)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Detalles:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            // Prioridad ya se muestra en el encabezado; se omite aquí para evitar duplicado
                            Spacer(modifier = Modifier.height(8.dp))
                            if (!ticket.categoryName.isNullOrBlank()) {
                                Text("Categoría: ${ticket.categoryName}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!ticket.clientDepartment.isNullOrBlank()) {
                                Text("Departamento: ${ticket.clientDepartment}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!ticket.clientEmail.isNullOrBlank()) {
                                Text("Email: ${ticket.clientEmail}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!ticket.clientPhone.isNullOrBlank()) {
                                Text("Teléfono: ${ticket.clientPhone}", color = Color.Gray, fontSize = 14.sp)
                            }
                            if (!ticket.priorityJustification.isNullOrBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Justificación de prioridad:", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(ticket.priorityJustification!!, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Dispositivo: ${dispositivo ?: "—"}", color = Color.Gray, fontSize = 14.sp)
                            Text("S/N: ${serialNumber ?: "—"}", color = Color.Gray, fontSize = 14.sp)
                            Text("Problema: $problema", color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Ubicación:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(cleanAddress, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            OutlinedButton(
                                onClick = { openInMaps(context, cleanAddress) },
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("Abrir en Maps")
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Mostrar siempre el mapa como antes; centrar en un punto por defecto y mover si obtenemos coordenadas
                        val defaultTarget = remember { LatLng(19.4056, -99.0965) }
                        val cameraPositionState = rememberCameraPositionState {
                            position = CameraPosition.fromLatLngZoom(defaultTarget, 15f)
                        }

                        // Si ya tenemos coordenadas, animar la cámara a esa ubicación
                        LaunchedEffect(mapCoordinates) {
                            mapCoordinates?.let { target ->
                                cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(target, 15f))
                            }
                        }

                        GoogleMap(
                            modifier = Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(12.dp)),
                            cameraPositionState = cameraPositionState
                        ) {
                            mapCoordinates?.let { target ->
                                Marker(
                                    state = MarkerState(position = target),
                                    title = "Ubicación del Ticket"
                                )
                            }
                        }

                        if (geocodeTried && geocodeFailed) {
                            Text(
                                text = "No se pudo ubicar la dirección en el mapa",
                                color = Color.Gray,
                                fontSize = 12.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        when (ticket.status) {
                            TicketStatus.PENDIENTE -> {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Button(onClick = {
                                        viewModel.acceptTicket(ticket.id)
                                        navController.popBackStack()
                                    }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))) {
                                        Text("Aceptar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                    Button(onClick = {
                                        rejectReason = ""
                                        showRejectDialog = true
                                    }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)) {
                                        Text("Rechazar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            TicketStatus.EN_PROCESO -> {
                                Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Button(
                                        onClick = {
                                            val encodedIdNav = URLEncoder.encode(ticket.id, StandardCharsets.UTF_8.toString())
                                            val encodedTitleNav = URLEncoder.encode(ticket.title, StandardCharsets.UTF_8.toString())
                                            val encodedCompanyNav = URLEncoder.encode(ticket.company, StandardCharsets.UTF_8.toString())
                                            val encodedAssignedToNav = URLEncoder.encode(ticket.assignedTo, StandardCharsets.UTF_8.toString())
                                            val encodedStatusNav = URLEncoder.encode(ticket.status.displayName, StandardCharsets.UTF_8.toString())
                                            val encodedPriorityNav = URLEncoder.encode(ticket.priority, StandardCharsets.UTF_8.toString())
                                            navController.navigate("tecnico_ticket_attachments/$encodedIdNav/$encodedTitleNav/$encodedCompanyNav/$encodedAssignedToNav/$encodedStatusNav/$encodedPriorityNav")
                                        },
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(12.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                                    ) {
                                        Text("Adjuntar evidencias", color = MaterialTheme.colorScheme.onSecondary, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                    Button(
                                        onClick = { showCloseConfirmationDialog = true },
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(12.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                                    ) {
                                        Text("Cerrar Ticket", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            TicketStatus.COMPLETADO, TicketStatus.RECHAZADO -> {
                                Button(
                                    onClick = {
                                        val encodedIdNav = URLEncoder.encode(ticket.id, StandardCharsets.UTF_8.toString())
                                        val encodedTitleNav = URLEncoder.encode(ticket.title, StandardCharsets.UTF_8.toString())
                                        val encodedCompanyNav = URLEncoder.encode(ticket.company, StandardCharsets.UTF_8.toString())
                                        val encodedAssignedToNav = URLEncoder.encode(ticket.assignedTo, StandardCharsets.UTF_8.toString())
                                        val encodedStatusNav = URLEncoder.encode(ticket.status.displayName, StandardCharsets.UTF_8.toString())
                                        val encodedPriorityNav = URLEncoder.encode(ticket.priority, StandardCharsets.UTF_8.toString())
                                        navController.navigate("tecnico_ticket_attachments/$encodedIdNav/$encodedTitleNav/$encodedCompanyNav/$encodedAssignedToNav/$encodedStatusNav/$encodedPriorityNav")
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                                ) {
                                    Text("Adjuntar evidencias", color = MaterialTheme.colorScheme.onSecondary, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

    private fun cleanDescription(description: String): String {
        // Remueve líneas del bloque de hardware (con o sin guiones/bullets) para evitar duplicados en la UI
        return description
            .lines()
            .filterNot { line ->
                val normalized = line.trim().replaceFirst("^[\\-•\\s]+".toRegex(), "")
                normalized.equals("Hardware:", ignoreCase = true) ||
                normalized.startsWith("Dispositivo:", ignoreCase = true) ||
                normalized.startsWith("S/N:", ignoreCase = true) ||
                normalized.startsWith("Serie:", ignoreCase = true) ||
                normalized.startsWith("Serial:", ignoreCase = true)
            }
            .joinToString("\n")
            .replace("\n\n\n", "\n\n") // compactar saltos extra
            .trim()
    }

    private fun parseHardwareFromDescription(description: String): Pair<String?, String?> {
        var device: String? = null
        var serial: String? = null
        description.lines().forEach { raw ->
            val line = raw.trim().replaceFirst("^[\\-•\\s]+".toRegex(), "")
            when {
                line.startsWith("Dispositivo:", ignoreCase = true) -> {
                    device = line.substringAfter(":").trim().ifBlank { null }
                }
                line.startsWith("S/N:", ignoreCase = true) || line.startsWith("Serie:", ignoreCase = true) || line.startsWith("Serial:", ignoreCase = true) -> {
                    serial = line.substringAfter(":").trim().ifBlank { null }
                }
            }
        }
        return device to serial
    }
// Usa StatusBadge y PriorityBadge compartidos en TicketComponents.kt

private suspend fun geocodeAddressFast(context: Context, address: String): LatLng? {
    // 0) caché en memoria
    GeocodeCache[address]?.let { return it }
    return coroutineScope {
        val deviceJob = async(Dispatchers.IO) { deviceGeocode(context, address) }
        val webJob = async(Dispatchers.IO) { webGeocode(address) }

        // Espera corta al geocoder del dispositivo
        val deviceFirst = withTimeoutOrNull(1800) { deviceJob.await() }
        var result = deviceFirst ?: withTimeoutOrNull(2500) { webJob.await() }
        // Cancela el otro job si sigue vivo
        if (!deviceJob.isCompleted) deviceJob.cancel()
        if (!webJob.isCompleted) webJob.cancel()

        // Fallback: intenta con ", México" si no hubo resultado
        if (result == null) {
            val alt = "$address, México"
            val altDevice = withTimeoutOrNull(1200) { deviceGeocode(context, alt) }
            result = altDevice ?: withTimeoutOrNull(2000) { webGeocode(alt) }
        }

        result?.also { GeocodeCache[address] = it }
    }
}

private fun deviceGeocode(context: Context, address: String): LatLng? = try {
    val geocoder = Geocoder(context, Locale("es", "MX"))
    @Suppress("DEPRECATION")
    val addresses = geocoder.getFromLocationName(address, 1)
    if (addresses?.isNotEmpty() == true) LatLng(addresses[0].latitude, addresses[0].longitude) else null
} catch (_: Exception) { null }

private fun webGeocode(address: String): LatLng? = try {
    val urlStr = "https://nominatim.openstreetmap.org/search?format=json&q=" + URLEncoder.encode(address, "UTF-8") + "&limit=1&addressdetails=0&countrycodes=mx"
    val url = URL(urlStr)
    val conn = (url.openConnection() as HttpURLConnection).apply {
        requestMethod = "GET"
        setRequestProperty("User-Agent", "MAC-Tickets/1.0 (android-app)")
        setRequestProperty("Accept-Language", "es-MX,es;q=0.9")
        connectTimeout = 3500
        readTimeout = 3500
    }
    conn.inputStream.use { stream ->
        val body = stream.bufferedReader().readText()
        val arr = JSONArray(body)
        if (arr.length() > 0) {
            val obj = arr.getJSONObject(0)
            val lat = obj.optString("lat").toDoubleOrNull()
            val lon = obj.optString("lon").toDoubleOrNull()
            if (lat != null && lon != null) LatLng(lat, lon) else null
        } else null
    }
} catch (_: Exception) { null }

private object GeocodeCache {
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

private fun openInMaps(context: Context, address: String) {
    try {
        val uri = Uri.parse("geo:0,0?q=" + Uri.encode(address))
        val intent = Intent(Intent.ACTION_VIEW, uri)
        intent.setPackage("com.google.android.apps.maps")
        if (intent.resolveActivity(context.packageManager) == null) {
            // Fallback sin paquete específico
            context.startActivity(Intent(Intent.ACTION_VIEW, uri))
        } else {
            context.startActivity(intent)
        }
    } catch (_: Exception) { /* ignorar */ }
}

private fun sanitizeAddress(raw: String): String {
    if (raw.isBlank()) return raw
    // Mantener toda la dirección en una sola línea con más contexto para mejorar geocodificación
    val cleaned = raw.trim()
        .removePrefix("Ubicación:")
        .removePrefix("Ubicacion:")
        .removePrefix("Location:")
        .trim()
        .replace(Regex("[\n\r]+"), " ")
        .replace("  ", " ")
    return cleaned
}