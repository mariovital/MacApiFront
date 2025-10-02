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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Create
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

// Data classes for the ticket system
data class TecnicoTicket(
    val id: String,
    val title: String,
    val company: String,
    val assignedTo: String,
    val status: TicketStatus,
    val priority: String,
    val description: String,
    val date: String
)

enum class TicketStatus(val displayName: String, val color: Color) {
    PENDIENTE("Pendiente", Color(0xFFFFBE00)),
    EN_PROCESO("En proceso", Color(0xFF43A0EE))
}

enum class TicketPriority(val displayName: String, val color: Color) {
    NA("N/A", Color(0xFF69696E)),
    Activo("Activo", Color(0xFF1EC40A)),
    Completado("Completado", Color(0xFFF50D0D))
}

@Composable
fun TecnicoTickets(navController: NavController) {
    // Sample data - this will be replaced with real data from your backend
    var tickets by remember {
        mutableStateOf(
            listOf<TecnicoTicket>(
                // Uncomment to test with sample data:

                TecnicoTicket(
                    id = "#10123",
                    title = "Pantalla Rota Dell.",
                    company = "ITESM S.A de C.V",
                    assignedTo = "Omar Felipe",
                    status = TicketStatus.PENDIENTE,
                    priority = TicketPriority.NA.displayName,
                    description = "Esperando su confirmación.",
                    date = ""
                ),
                TecnicoTicket(
                    id = "#10124",
                    title = "Pantalla Rota Dell.",
                    company = "ITESM S.A de C.V",
                    assignedTo = "Omar Felipe",
                    status = TicketStatus.EN_PROCESO,
                    priority = TicketPriority.Activo.displayName,
                    description = "Nos vemos.",
                    date = ""
                ),
                TecnicoTicket(
                    id = "#10125",
                    title = "Pantalla Rota Dell.",
                    company = "ITESM S.A de C.V",
                    assignedTo = "Omar Felipe",
                    status = TicketStatus.EN_PROCESO,
                    priority = TicketPriority.Activo.displayName,
                    description = "Nos volvemos una mesa",
                    date = ""
                ),
                TecnicoTicket(
                    id = "#10123",
                    title = "Pantalla Rota Dell.",
                    company = "ITESM S.A de C.V",
                    assignedTo = "Omar Felipe",
                    status = TicketStatus.PENDIENTE,
                    priority = TicketPriority.NA.displayName,
                    description = "Esperando su confirmación.",
                    date = ""
                )


            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFCFE3F3))
    ) {
        // Content Section
        if (tickets.isEmpty()) {
            EmptyTicketsState()
        } else {
            TicketsList(tickets = tickets, navController = navController)
        }
    }
}

@Composable
private fun EmptyTicketsState() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
        contentAlignment = Alignment.Center

    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(32.dp)
        ) {
            // Icon
            Icon(
                imageVector = Icons.Default.Create,
                contentDescription = "Sin tickets",
                modifier = Modifier
                    .size(80.dp)
                    .padding(bottom = 24.dp),
                tint = Color.Gray.copy(alpha = 0.6f)
            )

            // Main message
            Text(
                text =  "Sin ticket\nasignado",
                fontSize = 24.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Gray,
                textAlign = TextAlign.Center,
                lineHeight = 28.sp
            )
        }
    }
}

@Composable
private fun TicketsList(tickets: List<TecnicoTicket>, navController: NavController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(vertical = 16.dp)
    ) {
        items(tickets) { ticket ->
            TicketCard(ticket = ticket, navController = navController)
        }
    }
}

@Composable
private fun TicketCard(ticket: TecnicoTicket, navController: NavController) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 2.dp
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header with user info and ticket ID
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // User avatar
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.Gray.copy(alpha = 0.3f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "User",
                            modifier = Modifier.size(20.dp),
                            tint = Color.Gray
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Row {
                        Text(
                            text = ticket.assignedTo,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Spacer(modifier = Modifier.width(8.dp))

                        // Status badge
                        Box(
                            modifier = Modifier
                                .background(
                                    color = ticket.status.color,
                                    shape = RoundedCornerShape(12.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = ticket.status.displayName,
                                fontSize = 10.sp,
                                color = Color.White,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                // Ticket ID and priority
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = ticket.id,
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    // Encuentra el enum de prioridad basado en displayName
                    val priorityEnum = TicketPriority.values().find { it.displayName == ticket.priority }
                    if (priorityEnum != null) { // Solo mostrar si se encuentra una prioridad válida
                        Box(
                            modifier = Modifier
                                .background(
                                    color = priorityEnum.color, // Usar el color del enum encontrado
                                    shape = RoundedCornerShape(12.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = ticket.priority, // Este es el displayName, que es correcto aquí
                                fontSize = 10.sp,
                                color = Color.White // Cambiado a blanco para consistencia
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Ticket title with icon
            Row(
                verticalAlignment = Alignment.Top
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = "Ticket",
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.primary
                )

                Spacer(modifier = Modifier.width(8.dp))

                Column {
                    Text(
                        text = ticket.title,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Row{
                        Box(
                            modifier = Modifier
                                .size(5.dp)
                                .background(
                                    color = Color(0xFF838383),
                                    shape = CircleShape
                                )
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = ticket.company,
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }

                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Description
            if (ticket.description.isNotEmpty()) {
                Text(
                    text = ticket.description,
                    fontSize = 14.sp,
                    color = Color.Gray,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(12.dp))
            }

            // Action button
            Button(
                onClick = {
                    val encodedId = URLEncoder.encode(ticket.id, StandardCharsets.UTF_8.toString())
                    val encodedTitle = URLEncoder.encode(ticket.title, StandardCharsets.UTF_8.toString())
                    val encodedCompany = URLEncoder.encode(ticket.company, StandardCharsets.UTF_8.toString())
                    val encodedAssignedTo = URLEncoder.encode(ticket.assignedTo, StandardCharsets.UTF_8.toString())
                    val encodedStatus = URLEncoder.encode(ticket.status.displayName, StandardCharsets.UTF_8.toString())
                    val encodedPriority = URLEncoder.encode(ticket.priority, StandardCharsets.UTF_8.toString())
                    val encodedDescription = URLEncoder.encode(ticket.description, StandardCharsets.UTF_8.toString())

                    navController.navigate("tecnico_ticket_details/$encodedId/$encodedTitle/$encodedCompany/$encodedAssignedTo/$encodedStatus/$encodedPriority/$encodedDescription")
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF5C6BC0)
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = "Ver Detalles",
                    color = Color.White,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}