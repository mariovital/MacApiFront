package mx.tec.prototipo_01.ui.screens

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
import androidx.compose.runtime.remember
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
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TecnicoTicketDetails(
    navController: NavController,
    viewModel: TecnicoSharedViewModel,
    ticketId: String
) {
    val ticket = remember(ticketId) { viewModel.getTicketById(URLDecoder.decode(ticketId, StandardCharsets.UTF_8.toString())) }

    if (ticket == null) {
        navController.popBackStack()
        return
    }

    val dispositivo = "Dell Latitude 5420"
    val serialNumber = "000000000000"
    val problema = "La pantalla tiene un golpe el cual dejó inutilizable el dispositivo"
    val ubicacion = "Granjas México, Iztacalco, 08400 Ciudad de México, CDMX"
    val mapLocation = LatLng(19.4056, -99.0965)

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
                    Row(verticalAlignment = Alignment.Bottom) { // Changed alignment
                        Text("Detalles del Ticket", fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onPrimary)
                        Box(
                            modifier = Modifier
                                .padding(start = 4.dp, bottom = 4.dp) // Added padding
                                .size(7.dp)
                                .background(color = MaterialTheme.colorScheme.error, shape = CircleShape)
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
                            Text(ticket.description, style = MaterialTheme.typography.bodyLarge, lineHeight = 24.sp, color = Color.Gray)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Detalles:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Dispositivo: $dispositivo", color = Color.Gray, fontSize = 14.sp)
                            Text("S/N: $serialNumber", color = Color.Gray, fontSize = 14.sp)
                            Text("Problema: $problema", color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text("Ubicación:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(ubicacion, color = Color.Gray, fontSize = 14.sp, lineHeight = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

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
                                        viewModel.rejectTicket(ticket.id)
                                        navController.popBackStack()
                                    }, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)) {
                                        Text("Rechazar", color = Color.White, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            TicketStatus.EN_PROCESO, TicketStatus.COMPLETADO, TicketStatus.RECHAZADO -> {
                                Button(
                                    onClick = {
                                        val encodedIdNav = URLEncoder.encode(ticket.id, StandardCharsets.UTF_8.toString())
                                        val encodedTitleNav = URLEncoder.encode(ticket.title, StandardCharsets.UTF_8.toString())
                                        val encodedCompanyNav = URLEncoder.encode(ticket.company, StandardCharsets.UTF_8.toString())
                                        val encodedAssignedToNav = URLEncoder.encode(ticket.assignedTo, StandardCharsets.UTF_8.toString())
                                        val encodedStatusNav = URLEncoder.encode(ticket.status.displayName, StandardCharsets.UTF_8.toString())
                                        val encodedPriorityNav = URLEncoder.encode(ticket.priority, StandardCharsets.UTF_8.toString())
                                        navController.navigate("tecnico_ticket_chat/$encodedIdNav/$encodedTitleNav/$encodedCompanyNav/$encodedAssignedToNav/$encodedStatusNav/$encodedPriorityNav")
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                                ) {
                                    Text("Ir a chat", color = MaterialTheme.colorScheme.onSecondary, modifier = Modifier.padding(vertical = 8.dp), fontWeight = FontWeight.Bold)
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