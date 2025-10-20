package mx.tec.prototipo_01.ui.screens

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Geocoder
import android.net.Uri
import android.os.SystemClock
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
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
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
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import mx.tec.prototipo_01.BuildConfig
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.models.TicketStatus
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import android.util.Log

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TecnicoTicketDetails(
    navController: NavController,
    viewModel: TecnicoSharedViewModel,
    ticketId: String
) {
    val ticket = remember(ticketId) { viewModel.getTicketById(URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString())) }
    var showCloseConfirmationDialog by remember { mutableStateOf(false) }
    var showRejectDialog by remember { mutableStateOf(false) }
    var rejectReason by remember { mutableStateOf("") }

    LaunchedEffect(ticketId) {
        viewModel.refreshTicketDetail(URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString()))
    }

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
                Button(onClick = {
                    viewModel.closeTicket(ticket.id)
                    showCloseConfirmationDialog = false
                    navController.popBackStack()
                }) { Text("Confirmar") }
            },
            dismissButton = { Button(onClick = { showCloseConfirmationDialog = false }) { Text("Cancelar") } }
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
                    OutlinedTextField(
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
            dismissButton = { Button(onClick = { showRejectDialog = false }) { Text("Cancelar") } }
        )
    }

    val (dispositivo, serialNumber, problema) = remember(ticket.description) { parseDescription(ticket.description) }
    val ubicacion = ticket.location ?: "—"
    val cleanAddress = remember(ubicacion) { sanitizeAddress(ubicacion) }
    val context = LocalContext.current
    var mapCoordinates by remember(ubicacion) { mutableStateOf<LatLng?>(null) }
    var geocodeTried by remember(ubicacion) { mutableStateOf(false) }
    var geocodeFailed by remember(ubicacion) { mutableStateOf(false) }

    LaunchedEffect(cleanAddress) {
        if (cleanAddress.isNotBlank() && cleanAddress != "—") {
            mapCoordinates = geocodeAddressFast(context, cleanAddress, BuildConfig.MAPS_API_KEY)
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
                            navController.navigateUp()
                        }
                    }) { Icon(Icons.Default.ArrowBack, contentDescription = "Volver atrás", tint = MaterialTheme.colorScheme.onPrimary) }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = topBarColor)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp)
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
                                Text(text = ticket.id, fontSize = 12.sp, color = Color.Gray, modifier = Modifier.background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp))
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
                            Text(remember(ticket.description) { cleanDescription(ticket.description) }, style = MaterialTheme.typography.bodyLarge, lineHeight = 24.sp, color = Color.Gray)
                        }
                        Spacer(modifier = Modifier.height(24.dp))
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Detalles:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            if (!ticket.categoryName.isNullOrBlank()) Text("Categoría: ${ticket.categoryName}", color = Color.Gray, fontSize = 14.sp)
                            if (!ticket.clientDepartment.isNullOrBlank()) Text("Departamento: ${ticket.clientDepartment}", color = Color.Gray, fontSize = 14.sp)
                            if (!ticket.clientEmail.isNullOrBlank()) Text("Email: ${ticket.clientEmail}", color = Color.Gray, fontSize = 14.sp)
                            if (!ticket.clientPhone.isNullOrBlank()) Text("Teléfono: ${ticket.clientPhone}", color = Color.Gray, fontSize = 14.sp)
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
                            OutlinedButton(onClick = { openInMaps(context, cleanAddress) }, shape = RoundedCornerShape(12.dp)) { Text("Abrir en Maps") }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        val defaultTarget = remember { LatLng(19.4056, -99.0965) }
                        val cameraPositionState = rememberCameraPositionState { position = CameraPosition.fromLatLngZoom(defaultTarget, 15f) }
                        LaunchedEffect(mapCoordinates) { mapCoordinates?.let { target -> cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(target, 15f)) } }
                        GoogleMap(modifier = Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(12.dp)), cameraPositionState = cameraPositionState) {
                            mapCoordinates?.let { target -> Marker(state = MarkerState(position = target), title = "Ubicación del Ticket") }
                        }
                        if (geocodeTried && geocodeFailed) Text(text = "No se pudo ubicar la dirección en el mapa", color = Color.Gray, fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(24.dp))
                        when (ticket.status) {
                            TicketStatus.PENDIENTE -> {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Button(onClick = { viewModel.acceptTicket(ticket.id); navController.popBackStack() }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))) { Text("Aceptar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold) }
                                    Button(onClick = { rejectReason = ""; showRejectDialog = true }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)) { Text("Rechazar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold) }
                                }
                            }
                            TicketStatus.EN_PROCESO -> {
                                Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Button(onClick = { navController.navigate("tecnico_ticket_attachments/${ticket.id.encodeUrl()}/${ticket.title.encodeUrl()}/${ticket.company.encodeUrl()}/${ticket.assignedTo.encodeUrl()}/${ticket.status.displayName.encodeUrl()}/${ticket.priority.encodeUrl()}") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)) { Text("Adjuntar evidencias", color = MaterialTheme.colorScheme.onSecondary, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold) }
                                    Button(onClick = { showCloseConfirmationDialog = true }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)) { Text("Cerrar Ticket", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold) }
                                }
                            }
                            TicketStatus.COMPLETADO, TicketStatus.RECHAZADO -> {
                                Button(onClick = { navController.navigate("tecnico_ticket_attachments/${ticket.id.encodeUrl()}/${ticket.title.encodeUrl()}/${ticket.company.encodeUrl()}/${ticket.assignedTo.encodeUrl()}/${ticket.status.displayName.encodeUrl()}/${ticket.priority.encodeUrl()}") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)) { Text("Ver evidencias", color = MaterialTheme.colorScheme.onSecondary, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold) }
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun String.encodeUrl(): String = URLEncoder.encode(this, StandardCharsets.UTF_8.toString())

private suspend fun geocodeAddressFast(context: Context, address: String, apiKey: String): LatLng? = coroutineScope {
    val deviceLookup = async { withTimeoutOrNull(1000) { getCoordinatesFromDevice(context, address) } }
    val googleWebLookup = async { withTimeoutOrNull(3000) { getCoordinatesFromGoogle(address, apiKey) } }
    deviceLookup.await() ?: googleWebLookup.await()
}

private suspend fun getCoordinatesFromDevice(context: Context, address: String): LatLng? = withContext(Dispatchers.IO) {
    try {
        val geocoder = Geocoder(context)
        @Suppress("DEPRECATION")
        geocoder.getFromLocationName(address, 1)?.firstOrNull()?.let { LatLng(it.latitude, it.longitude) }
    } catch (e: IOException) {
        Log.e("TecnicoTicketDetails", "Fallo el geocoder del dispositivo para la dirección: '$address'", e)
        null
    }
}

private suspend fun getCoordinatesFromGoogle(address: String, apiKey: String): LatLng? = withContext(Dispatchers.IO) {
    if (apiKey.isBlank()) {
        Log.e("TecnicoTicketDetails", "La API key de Google Geocoding está vacía.")
        return@withContext null
    }
    Log.d("TecnicoTicketDetails", "Buscando en Google Geocoding: '$address'")
    try {
        val url = URL("https://maps.googleapis.com/maps/api/geocode/json?address=${address.encodeUrl()}&key=$apiKey")
        (url.openConnection() as HttpURLConnection).run {
            requestMethod = "GET"
            connect()
            if (responseCode == HttpURLConnection.HTTP_OK) {
                inputStream.bufferedReader().use { it.readText() }.let { response ->
                    val jsonResponse = JSONObject(response)
                    if (jsonResponse.getString("status") == "OK") {
                        val results = jsonResponse.getJSONArray("results")
                        if (results.length() > 0) {
                            val location = results.getJSONObject(0).getJSONObject("geometry").getJSONObject("location")
                            return@withContext LatLng(location.getDouble("lat"), location.getDouble("lng"))
                        } else {
                            Log.w("TecnicoTicketDetails", "Google Geocoding no encontró resultados para: '$address'")
                        }
                    } else {
                        Log.e("TecnicoTicketDetails", "Google Geocoding API error: ${jsonResponse.getString("status")} - ${jsonResponse.optString("error_message", "")}")
                    }
                }
            } else {
                Log.e("TecnicoTicketDetails", "Google Geocoding devolvió error: $responseCode")
            }
        }
    } catch (e: Exception) {
        Log.e("TecnicoTicketDetails", "Fallo el geocoder de Google para: '$address'", e)
    }
    null
}

private fun sanitizeAddress(address: String): String = address.replace("-", " ")

private fun openInMaps(context: Context, address: String) {
    val intentUri = Uri.parse("geo:0,0?q=${Uri.encode(address)}")
    val mapIntent = Intent(Intent.ACTION_VIEW, intentUri)
    mapIntent.setPackage("com.google.android.apps.maps") // Prioriza Google Maps
    if (mapIntent.resolveActivity(context.packageManager) != null) {
        context.startActivity(mapIntent)
    } else { // Si no está Google Maps, abre el selector genérico
        val genericIntent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=${Uri.encode(address)}"))
        context.startActivity(genericIntent)
    }
}

private fun parseDescription(description: String): Triple<String?, String?, String> {
    val lines = description.lines()
    var dispositivo: String? = null
    var serie: String? = null
    val problemLines = mutableListOf<String>()

    lines.forEach { line ->
        val trimmed = line.trim()
        when {
            trimmed.startsWith("Dispositivo:", ignoreCase = true) -> {
                dispositivo = trimmed.substringAfter(":").trim().ifBlank { null }
            }
            trimmed.startsWith("S/N:", ignoreCase = true) -> {
                serie = trimmed.substringAfter(":").trim().ifBlank { null }
            }
            else -> problemLines.add(line)
        }
    }
    return Triple(dispositivo, serie, problemLines.joinToString("\n").trim())
}

private fun cleanDescription(description: String): String {
    return description.lines().filterNot { line ->
        val normalized = line.trim().replaceFirst("^[-•\\s]+".toRegex(), "")
        normalized.equals("Hardware:", ignoreCase = true) ||
                normalized.startsWith("Dispositivo:", ignoreCase = true) ||
                normalized.startsWith("S/N:", ignoreCase = true) ||
                normalized.startsWith("Serie:", ignoreCase = true) ||
                normalized.startsWith("Serial:", ignoreCase = true)
    }.joinToString("\n").replace("\n\n\n", "\n\n").trim()
}

@Composable
fun StatusBadge(status: String) {
    val statusEnum = remember(status) { TicketStatus.values().find { it.displayName.equals(status, ignoreCase = true) } }
    if (statusEnum != null) {
        Box(modifier = Modifier.background(statusEnum.color, RoundedCornerShape(8.dp)).padding(horizontal = 10.dp, vertical = 4.dp)) {
            Text(statusEnum.displayName, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 12.sp)
        }
    }
}

@Composable
fun PriorityBadge(priority: String) {
    val priorityEnum = remember(priority) { TicketPriority.values().find { it.displayName.equals(priority, ignoreCase = true) } }
    if (priorityEnum != null) {
        Box(modifier = Modifier.background(priorityEnum.color, RoundedCornerShape(8.dp)).padding(horizontal = 10.dp, vertical = 4.dp)) {
            Text(priorityEnum.displayName, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 12.sp)
        }
    }
}
