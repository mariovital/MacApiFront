package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel
import mx.tec.prototipo_01.viewmodels.TicketsUiState
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Composable
fun TecnicoTickets(navController: NavController, viewModel: TecnicoSharedViewModel) {
    val state = viewModel.pendingTicketsState
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        when (state) {
            is TicketsUiState.Loading -> LoadingState()
            is TicketsUiState.Error -> EmptyTicketsState()
            is TicketsUiState.Success -> {
                val tickets = state.tickets
                if (tickets.isEmpty()) EmptyTicketsState() else TicketsList(tickets = tickets, navController = navController)
            }
        }
    }
}

@Composable
private fun LoadingState() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator()
    }
}

@Composable
private fun EmptyTicketsState() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background), // Use theme background color
        contentAlignment = Alignment.Center

    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(32.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Create,
                contentDescription = "Sin tickets",
                modifier = Modifier
                    .size(80.dp)
                    .padding(bottom = 24.dp),
                tint = Color.Gray.copy(alpha = 0.6f)
            )
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
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        items(tickets, key = { it.id }) { ticket -> // Use key for better performance
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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
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
                        StatusBadgeChip(status = ticket.status.displayName)
                    }
                }
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = ticket.id,
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    PriorityBadgeChip(priority = ticket.priority)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
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
            if (ticket.description.isNotEmpty()) {
                val descripcionLimpia = remember(ticket.description) { cleanDescription(ticket.description) }
                Text(
                    text = descripcionLimpia,
                    fontSize = 14.sp,
                    color = Color.Gray,
                    lineHeight = 18.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
            Button(
                onClick = {
                    // Navigate to details using only the ID, the rest will be fetched from the viewModel
                    val encodedId = URLEncoder.encode(ticket.id, StandardCharsets.UTF_8.toString())
                    navController.navigate("tecnico_ticket_details/$encodedId")
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.secondary
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = "Ver Detalles",
                    color = MaterialTheme.colorScheme.onSecondary
                )
            }
        }
    }
}

// Mantener consistente con la limpieza usada en detalles
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
