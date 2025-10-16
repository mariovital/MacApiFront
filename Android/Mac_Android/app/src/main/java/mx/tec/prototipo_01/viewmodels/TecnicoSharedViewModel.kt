package mx.tec.prototipo_01.viewmodels

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.models.TicketStatus
import mx.tec.prototipo_01.models.api.TicketItem

class TecnicoSharedViewModel : ViewModel() {

    // 'Mis Tickets' (asignados al técnico) -> estados no finales
    val pendingTickets = mutableStateListOf<TecnicoTicket>()

    // 'Historial' (tickets finalizados por el técnico)
    val historyTickets = mutableStateListOf<TecnicoTicket>()

    // Mapa ticket_number -> id interno backend
    private val ticketIdMap = mutableMapOf<String, Int>()

    // Cargar tickets desde el backend, ya filtrados por rol (JWT)
    fun loadTickets() {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getTickets(limit = 100)
                if (response.isSuccessful) {
                    val body = response.body()
                    val items = body?.data?.items ?: emptyList()
                    // Mapear a UI y separar por estado
                    ticketIdMap.clear()
                    items.forEach { ticketIdMap[it.ticket_number] = it.id }
                    val mapped = items.map { it.toUiModel() }
                    pendingTickets.clear()
                    historyTickets.clear()
                    mapped.forEach { t ->
                        when (t.status) {
                            TicketStatus.COMPLETADO, TicketStatus.RECHAZADO -> historyTickets.add(t)
                            else -> pendingTickets.add(t)
                        }
                    }
                } else {
                    // En error, limpiar listas
                    pendingTickets.clear()
                    historyTickets.clear()
                }
            } catch (e: Exception) {
                // En excepción de red, limpiar listas
                pendingTickets.clear()
                historyTickets.clear()
            }
        }
    }

    fun getTicketById(id: String): TecnicoTicket? {
        return (pendingTickets + historyTickets).find { it.id == id }
    }

    // Refrescar detalle desde backend usando el id numérico mapeado
    fun refreshTicketDetail(ticketNumber: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketNumber] ?: return@launch
                val res = RetrofitClient.instance.getTicketById(backendId)
                if (res.isSuccessful) {
                    val apiItem = res.body()?.data ?: return@launch
                    val updated = apiItem.toUiModel()
                    // Reemplazar en pending o history según corresponda
                    val idxPending = pendingTickets.indexOfFirst { it.id == ticketNumber }
                    if (idxPending >= 0) {
                        pendingTickets[idxPending] = updated
                        return@launch
                    }
                    val idxHistory = historyTickets.indexOfFirst { it.id == ticketNumber }
                    if (idxHistory >= 0) {
                        historyTickets[idxHistory] = updated
                    }
                }
            } catch (_: Exception) { }
        }
    }

    fun acceptTicket(ticketId: String) {
        // ticketId es el ticket_number en UI
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                val res = RetrofitClient.instance.acceptTicket(backendId)
                if (res.isSuccessful) {
                    // Refrescar ese ticket
                    refreshTicketDetail(ticketId)
                } else {
                    loadTickets()
                }
            } catch (e: Exception) {
                // ignorar
            }
        }
    }

    fun rejectTicket(ticketId: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                val res = RetrofitClient.instance.rejectTicket(backendId, mx.tec.prototipo_01.models.api.RejectTicketRequest())
                if (res.isSuccessful) {
                    refreshTicketDetail(ticketId)
                } else {
                    loadTickets()
                }
            } catch (e: Exception) {
                // ignorar
            }
        }
    }

    fun closeTicket(ticketId: String) {
        val ticket = pendingTickets.find { it.id == ticketId } ?: return
        ticket.status = TicketStatus.COMPLETADO
        pendingTickets.remove(ticket)
        historyTickets.add(0, ticket)
    }
}

// Extensión: mapear modelo del API a modelo de UI
private fun TicketItem.toUiModel(): TecnicoTicket {
    val assignedName = listOfNotNull(assignee?.first_name, assignee?.last_name)
        .joinToString(" ").ifBlank { assignee?.username ?: "" }
    val companyName = client_company ?: run {
        val fn = creator?.first_name
        val ln = creator?.last_name
        listOfNotNull(fn, ln).joinToString(" ")
    }

    // Mapear status_id a TicketStatus de UI
    val uiStatus = when (status_id) {
        1 -> TicketStatus.PENDIENTE
        2 -> TicketStatus.PENDIENTE // Asignado se muestra como Pendiente hasta aceptar
        3, 4 -> TicketStatus.EN_PROCESO // En Proceso/En Espera
        5, 6 -> TicketStatus.COMPLETADO
        else -> TicketStatus.PENDIENTE
    }

    // Mapear prioridad
    val uiPriority = (priority?.name ?: TicketPriority.NA.displayName).let { name ->
        val match = TicketPriority.values().find { it.displayName.equals(name, true) }
        match?.displayName ?: name
    }

    return TecnicoTicket(
        backendId = id,
        id = ticket_number,
        title = title,
        company = companyName,
        assignedTo = assignedName,
        status = uiStatus,
        priority = uiPriority,
        description = description ?: "",
        date = created_at ?: "",
        location = location,
        priorityJustification = priority_justification,
        clientContact = client_contact,
        clientEmail = client_email,
        clientPhone = client_phone,
        clientDepartment = client_department,
        categoryName = category?.name
    )
}