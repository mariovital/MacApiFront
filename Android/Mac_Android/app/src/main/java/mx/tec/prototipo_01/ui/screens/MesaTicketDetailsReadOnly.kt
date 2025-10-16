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
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import java.io.IOException
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONArray
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.TicketStatus
import mx.tec.prototipo_01.models.api.AssignTicketRequest
import mx.tec.prototipo_01.models.api.TechnicianDto

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MesaTicketDetailsReadOnly(
    navController: NavController,
    viewModel: MesaAyudaSharedViewModel,
    ticketId: String
) {
    val decodedId = remember(ticketId) { URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString()) }
    val ticket = remember(decodedId) { viewModel.getTicketById(decodedId) }

    LaunchedEffect(ticketId) {
        viewModel.refreshTicketDetail(decodedId)
    }

    if (ticket == null) {
        navController.popBackStack()
        return
    }

    val ubicacion = ticket.location ?: "—"
    val cleanAddress = remember(ubicacion) { sanitizeAddress(ubicacion) }
    val context = LocalContext.current
    var mapCoordinates by remember(ubicacion) { mutableStateOf<LatLng?>(null) }
    var geocodeTried by remember(ubicacion) { mutableStateOf(false) }
    var geocodeFailed by remember(ubicacion) { mutableStateOf(false) }

    LaunchedEffect(cleanAddress) {
        if (cleanAddress.isNotBlank() && cleanAddress != "—") {
            mapCoordinates = withContext(Dispatchers.IO) { getCoordinatesFromAddress(context, cleanAddress) }
            if (mapCoordinates == null) {
                mapCoordinates = withContext(Dispatchers.IO) { getCoordinatesFromNominatim(cleanAddress) }
            }
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
                    IconButton(onClick = { navController.popBackStack() }) {
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
                            if (ticket.status == mx.tec.prototipo_01.models.TicketStatus.RECHAZADO && !ticket.rejectionReason.isNullOrBlank()) {
                                Text("Motivo del rechazo:", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    ticket.rejectionReason!!,
                                    color = MaterialTheme.colorScheme.error,
                                    fontSize = 14.sp,
                                    lineHeight = 20.sp
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                            }
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
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Ubicación:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(cleanAddress, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        val defaultTarget = remember { LatLng(19.4056, -99.0965) }
                        val cameraPositionState = rememberCameraPositionState {
                            position = CameraPosition.fromLatLngZoom(defaultTarget, 15f)
                        }
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
                                Marker(state = MarkerState(position = target), title = "Ubicación del Ticket")
                            }
                        }
                        if (geocodeTried && geocodeFailed) {
                            Text(text = "No se pudo ubicar la dirección en el mapa", color = Color.Gray, fontSize = 12.sp)
                        }

                        // Si el ticket está rechazado, permitir reasignar a un técnico
                        if (ticket.status == TicketStatus.RECHAZADO) {
                            Spacer(modifier = Modifier.height(24.dp))
                            Text("Reasignar a técnico:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))

                            var technicians by remember { mutableStateOf(listOf<TechnicianDto>()) }
                            var selectedTech by remember { mutableStateOf<TechnicianDto?>(null) }
                            var expanded by remember { mutableStateOf(false) }

                            LaunchedEffect(Unit) {
                                val resp = RetrofitClient.instance.getTechnicians()
                                if (resp.isSuccessful) {
                                    technicians = resp.body()?.data ?: emptyList()
                                }
                            }

                            ExposedDropdownMenuBox(
                                expanded = expanded,
                                onExpandedChange = { expanded = it }
                            ) {
                                OutlinedTextField(
                                    value = selectedTech?.let { listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" } } ?: "",
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Selecciona técnico") },
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

                            Spacer(modifier = Modifier.height(12.dp))
                            Button(
                                onClick = {
                                    val idNum = ticket.backendId
                                    val techId = selectedTech?.id
                                    if (techId != null) {
                                        // Llamar al endpoint de asignación
                                        kotlinx.coroutines.CoroutineScope(Dispatchers.IO).launch {
                                            try {
                                                val res = RetrofitClient.instance.assignTicket(idNum, AssignTicketRequest(technician_id = techId))
                                                withContext(Dispatchers.Main) {
                                                    if (res.isSuccessful) {
                                                        // Refrescar detalle y listas
                                                        viewModel.refreshTicketDetail(ticket.id)
                                                        viewModel.loadTickets()
                                                        // Indicar a la pantalla anterior que seleccione la pestaña de "Tickets" y cerrar
                                                        navController.previousBackStackEntry
                                                            ?.savedStateHandle
                                                            ?.set("mesa_select_tab", 0)
                                                        navController.popBackStack()
                                                    }
                                                }
                                            } catch (_: Exception) { }
                                        }
                                    }
                                },
                                modifier = Modifier.fillMaxWidth()
                            ) {
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
    return address.replace("-", " ")
}

private fun getCoordinatesFromAddress(context: Context, address: String): LatLng? {
    return try {
        val geocoder = Geocoder(context)
        @Suppress("DEPRECATION")
        val addresses = geocoder.getFromLocationName(address, 1)
        if (addresses?.isNotEmpty() == true) {
            LatLng(addresses[0].latitude, addresses[0].longitude)
        } else {
            null
        }
    } catch (e: IOException) {
        null
    }
}

private fun getCoordinatesFromNominatim(address: String): LatLng? {
    return try {
        val url = URL("https://nominatim.openstreetmap.org/search?q=${URLEncoder.encode(address, "UTF-8")}&format=json&limit=1")
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        connection.connect()

        val responseCode = connection.responseCode
        if (responseCode == HttpURLConnection.HTTP_OK) {
            val reader = connection.inputStream.bufferedReader()
            val response = reader.readText()
            reader.close()
            val jsonArray = JSONArray(response)
            if (jsonArray.length() > 0) {
                val jsonObject = jsonArray.getJSONObject(0)
                val lat = jsonObject.getDouble("lat")
                val lon = jsonObject.getDouble("lon")
                LatLng(lat, lon)
            } else {
                null
            }
        } else {
            null
        }
    } catch (e: Exception) {
        null
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
