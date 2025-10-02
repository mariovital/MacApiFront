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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.Divider
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.navigation.NavController
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
    val decodedAssignedTo = assignedTo?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedStatus = status?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedPriority = priority?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"
    val decodedDescription = description?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "N/A"

    val view = LocalView.current
    val topBarColor = Color(0xFF424242) // Dark color for the top bar
    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = topBarColor.toArgb()
        // Use false for light icons on a dark background
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Detalles del Ticket", fontWeight = FontWeight.SemiBold, color = Color.White) }, // Title color to white
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver atrás", tint = Color.White) // Icon color to white
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = topBarColor
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFCFE3F3))
                .padding(padding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    // Título y ID
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Text(
                            text = decodedTitle,
                            fontWeight = FontWeight.Bold,
                            fontSize = 22.sp,
                            modifier = Modifier.weight(1f)
                        )
                        Text(
                            text = decodedId,
                            fontSize = 14.sp,
                            color = Color.Gray
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Info de la compañía
                    InfoRow(label = "Compañía:", value = decodedCompany)
                    InfoRow(label = "Asignado a:", value = decodedAssignedTo)

                    Spacer(modifier = Modifier.height(16.dp))

                    // Estado y Prioridad
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        StatusBadge(status = decodedStatus)
                        PriorityBadge(priority = decodedPriority)
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Divider()
                    Spacer(modifier = Modifier.height(16.dp))

                    // Descripción
                    Text(
                        text = "Descripción",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = decodedDescription,
                        style = MaterialTheme.typography.bodyLarge,
                        lineHeight = 24.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row {
        Text(
            text = label,
            fontWeight = FontWeight.SemiBold,
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.width(100.dp)
        )
        Text(text = value, style = MaterialTheme.typography.bodyLarge)
    }
    Spacer(modifier = Modifier.height(4.dp))
}

@Composable
private fun StatusBadge(status: String) {
    val statusEnum = TicketStatus.values().find { it.displayName == status }
    if (statusEnum != null) {
        Box(
            modifier = Modifier
                .background(statusEnum.color, RoundedCornerShape(12.dp))
                .padding(horizontal = 12.dp, vertical = 4.dp)
        ) {
            Text(
                text = statusEnum.displayName,
                color = Color.White,
                fontWeight = FontWeight.Medium,
                fontSize = 12.sp
            )
        }
    }
}

@Composable
private fun PriorityBadge(priority: String) {
    val priorityEnum = TicketPriority.values().find { it.displayName == priority }
    if (priorityEnum != null) {
        Box(
            modifier = Modifier
                .background(priorityEnum.color, RoundedCornerShape(12.dp))
                .padding(horizontal = 12.dp, vertical = 4.dp)
        ) {
            Text(
                text = priorityEnum.displayName,
                color = Color.White,
                fontWeight = FontWeight.Medium,
                fontSize = 12.sp
            )
        }
    }
}
