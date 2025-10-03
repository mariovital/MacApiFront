package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.material3.Button
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.navigation.NavController
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.models.TicketStatus
import java.net.URLDecoder
import java.nio.charset.StandardCharsets

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TecnicoTicketDetails(
    navController: NavController,
    id: String?,
    title: String?,
    company: String?,
    assignedTo: String?,
    status: String?,
    priority: String?,
    description: String?
) {
    val decodedId = id?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedTitle = title?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedCompany = company?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedStatus = status?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedPriority = priority?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedDescription = description?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"

    val dispositivo = "Dell Latitude 5420"
    val serialNumber = "000000000000"
    val problema = "La pantalla tiene un golpe el cual dejó inutilizable el dispositivo"
    val ubicacion = "Granjas México, Iztacalco, 08400 Ciudad de México, CDMX"
    // Hardcoded coordinates for Palacio de los Deportes
    val mapLocation = LatLng(19.4056, -99.0965)

    val view = LocalView.current
    val topBarColor = Color(0xFF424242)
    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = topBarColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
    }

    Scaffold(
        containerColor = Color(0xFFF0F4F8),
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Detalles del Ticket", fontWeight = FontWeight.SemiBold, color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver atrás", tint = Color.White)
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
                        // Section 1: User/Status and ID/Priority
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Person, "Usuario", tint = Color.LightGray, modifier = Modifier.size(24.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                StatusBadge(status = decodedStatus)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = decodedId,
                                    fontSize = 12.sp,
                                    color = Color.Gray,
                                    modifier = Modifier
                                        .background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                PriorityBadge(priority = decodedPriority)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Section 2: Title and Company
                        Row(verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.DateRange, "Ticket Title", modifier = Modifier.padding(top = 4.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(decodedTitle, fontWeight = FontWeight.Bold, fontSize = 22.sp)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("·", color = Color.Gray, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(decodedCompany, color = Color.Gray, fontSize = 14.sp)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Section 3: Short Description (Timeline)
                        Row(verticalAlignment = Alignment.Top) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(top = 8.dp)) {
                                Box(modifier = Modifier.width(1.dp).height(4.dp).background(Color.LightGray))
                                Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color.LightGray))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(decodedDescription, style = MaterialTheme.typography.bodyLarge, lineHeight = 24.sp, color = Color.Gray)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Section 4: Full Details
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Detalles:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Dispositivo: $dispositivo", color = Color.Gray, fontSize = 14.sp)
                            Text("S/N: $serialNumber", color = Color.Gray, fontSize = 14.sp)
                            Text("Problema: $problema", color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Section 5: Location
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Ubicación:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(ubicacion, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Section 6: Google Map
                        val cameraPositionState = rememberCameraPositionState {
                            position = CameraPosition.fromLatLngZoom(mapLocation, 15f)
                        }
                        GoogleMap(
                            modifier = Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(12.dp)),
                            cameraPositionState = cameraPositionState
                        ) {
                            Marker(
                                state = MarkerState(position = mapLocation),
                                title = "Ubicación del Ticket"
                            )
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Section 7: Action Buttons
                        when (decodedStatus) {
                            TicketStatus.PENDIENTE.displayName -> {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Button(onClick = { /* TODO: Accept */ }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))) {
                                        Text("Aceptar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                    Button(onClick = { /* TODO: Decline */ }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F))) {
                                        Text("Rechazar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            TicketStatus.EN_PROCESO.displayName, TicketStatus.COMPLETADO.displayName -> {
                                Button(
                                    onClick = { /* TODO: Go to chat */ },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF5C6BC0))
                                ) {
                                    Text("Ir a chat", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatusBadge(status: String) {
    val statusEnum = TicketStatus.values().find { it.displayName.equals(status, ignoreCase = true) }
    if (statusEnum != null) {
        Box(modifier = Modifier.background(statusEnum.color, RoundedCornerShape(8.dp)).padding(horizontal = 10.dp, vertical = 4.dp)) {
            Text(statusEnum.displayName, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 12.sp)
        }
    }
}

@Composable
private fun PriorityBadge(priority: String) {
    val priorityEnum = TicketPriority.values().find { it.displayName.equals(priority, ignoreCase = true) }
    if (priorityEnum != null) {
        Box(modifier = Modifier.background(priorityEnum.color, RoundedCornerShape(8.dp)).padding(horizontal = 10.dp, vertical = 4.dp)) {
            Text(priorityEnum.displayName, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 12.sp)
        }
    }
}