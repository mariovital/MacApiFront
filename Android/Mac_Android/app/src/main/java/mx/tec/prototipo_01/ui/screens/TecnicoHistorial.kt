package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
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
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
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
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel
import mx.tec.prototipo_01.viewmodels.TicketsUiState
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Composable
fun TecnicoHistorial(navController: NavController, viewModel: TecnicoSharedViewModel) {
    val state = viewModel.historyTicketsState

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        var filterExpanded by remember { mutableStateOf(false) }
        var selectedFilter by rememberSaveable { mutableStateOf(HistoryFilter.TODOS) }
        var searchQuery by rememberSaveable { mutableStateOf("") }
        var lastTickets by remember { mutableStateOf<List<TecnicoTicket>>(emptyList()) }

        val sourceTickets: List<TecnicoTicket> = when (state) {
            is TicketsUiState.Success -> {
                lastTickets = state.tickets
                state.tickets
            }
            is TicketsUiState.Loading -> lastTickets
            else -> emptyList()
        }

        if (state is TicketsUiState.Error) {
            EmptyTicketsState()
        } else if (sourceTickets.isEmpty()) {
            EmptyTicketsState()
        } else {
            Column(modifier = Modifier.fillMaxSize()) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    placeholder = { Text("Buscar por nombre") },
                    singleLine = true
                )

                val filtered = when (selectedFilter) {
                    HistoryFilter.TODOS -> sourceTickets
                    HistoryFilter.SOLO_COMPLETADOS -> sourceTickets.filter { it.status.displayName.contains("complet", true) || it.status.displayName.contains("resuelto", true) || it.status.displayName.contains("cerrado", true) }
                    HistoryFilter.SOLO_RECHAZADOS -> sourceTickets.filter { it.status.displayName.contains("rechaz", true) }
                }.let { list ->
                    if (searchQuery.isBlank()) list else list.filter { matchesSearch(it, searchQuery) }
                }

                TicketsList(tickets = filtered, navController = navController)
            }

            FloatingActionButton(
                onClick = { filterExpanded = true },
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp)
            ) {
                Icon(Icons.Default.FilterList, contentDescription = "Filtrar")
            }
            DropdownMenu(
                expanded = filterExpanded,
                onDismissRequest = { filterExpanded = false },
                modifier = Modifier.align(Alignment.BottomStart)
            ) {
                HistoryFilter.values().forEach { option ->
                    DropdownMenuItem(text = { Text(option.label) }, onClick = {
                        selectedFilter = option
                        filterExpanded = false
                    })
                }
            }
        }

        if (state is TicketsUiState.Loading) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .fillMaxWidth()
                    .padding(top = 4.dp)
            ) {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                )
            }
        }
    }
}

private enum class HistoryFilter(val label: String) {
    TODOS("Todos"),
    SOLO_COMPLETADOS("Completados"),
    SOLO_RECHAZADOS("Rechazados")
}

@Composable
private fun EmptyTicketsState() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
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
                text = "Sin tickets \npasados",
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
        items(tickets, key = { it.id }) { ticket ->
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
        Column(modifier = Modifier.padding(16.dp)) {
            androidx.compose.foundation.layout.Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                androidx.compose.foundation.layout.Row(
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
                    androidx.compose.foundation.layout.Spacer(modifier = Modifier.width(8.dp))
                    androidx.compose.foundation.layout.Row {
                        Text(
                            text = ticket.assignedTo,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        androidx.compose.foundation.layout.Spacer(modifier = Modifier.width(8.dp))
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
                Column(horizontalAlignment = Alignment.End) {
                    Text(text = ticket.id, fontSize = 12.sp, color = Color.Gray)
                    val priorityEnum = TicketPriority.values().find { it.displayName == ticket.priority }
                    if (priorityEnum != null) {
                        Box(
                            modifier = Modifier
                                .background(
                                    color = priorityEnum.color,
                                    shape = RoundedCornerShape(12.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(text = ticket.priority, fontSize = 10.sp, color = Color.White)
                        }
                    }
                }
            }
            androidx.compose.foundation.layout.Spacer(modifier = androidx.compose.ui.Modifier.size(12.dp))
            androidx.compose.foundation.layout.Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = "Ticket",
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                androidx.compose.foundation.layout.Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(text = ticket.title, fontSize = 20.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
                    androidx.compose.foundation.layout.Row {
                        Box(
                            modifier = Modifier
                                .size(5.dp)
                                .background(color = Color(0xFF838383), shape = CircleShape)
                        )
                        androidx.compose.foundation.layout.Spacer(modifier = Modifier.width(6.dp))
                        Text(text = ticket.company, fontSize = 11.sp, color = Color.Gray)
                    }
                }
            }
            androidx.compose.foundation.layout.Spacer(modifier = androidx.compose.ui.Modifier.size(8.dp))
            if (ticket.description.isNotEmpty()) {
                Text(text = ticket.description, fontSize = 14.sp, color = Color.Gray, lineHeight = 18.sp)
                androidx.compose.foundation.layout.Spacer(modifier = androidx.compose.ui.Modifier.size(12.dp))
            }
            Button(
                onClick = {
                    val encodedId = URLEncoder.encode(ticket.id, StandardCharsets.UTF_8.toString())
                    navController.navigate("tecnico_ticket_details/$encodedId")
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(text = "Ver Detalles", color = MaterialTheme.colorScheme.onSecondary)
            }
        }
    }
}

private fun matchesSearch(ticket: TecnicoTicket, query: String): Boolean {
    if (query.isBlank()) return true
    val q = query.trim()
    return listOf(ticket.id, ticket.title, ticket.company, ticket.assignedTo, ticket.description)
        .any { it.contains(q, ignoreCase = true) }
}