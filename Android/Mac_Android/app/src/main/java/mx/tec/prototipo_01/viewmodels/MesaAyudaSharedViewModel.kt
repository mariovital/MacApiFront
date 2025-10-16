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

class MesaAyudaSharedViewModel : ViewModel() {
    // Tickets creados por el usuario de mesa (backend filtra por rol)
    val pendingTickets = mutableStateListOf<TecnicoTicket>()
    val historyTickets = mutableStateListOf<TecnicoTicket>()

    // Mapa ticket_number -> id interno backend
    private val ticketIdMap = mutableMapOf<String, Int>()

    fun loadTickets() {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getTickets(limit = 100)
                if (response.isSuccessful) {
                    val body = response.body()
                    val items = body?.data?.items ?: emptyList()
                    ticketIdMap.clear()
                    items.forEach { ticketIdMap[it.ticket_number] = it.id }
                    val mapped = items.map { it.toUiModel() }
                    pendingTickets.clear()
                    historyTickets.clear()
                    mapped.forEach { t ->
                        when (t.status) {
                            TicketStatus.COMPLETADO -> historyTickets.add(t)
                            // Tickets rechazados quedan en la lista principal para permitir reasignación
                            TicketStatus.RECHAZADO -> pendingTickets.add(t)
                            else -> pendingTickets.add(t)
                        }
                    }
                } else {
                    pendingTickets.clear()
                    historyTickets.clear()
                }
            } catch (_: Exception) {
                pendingTickets.clear()
                historyTickets.clear()
            }
        }
    }

    fun getTicketById(id: String): TecnicoTicket? {
        return (pendingTickets + historyTickets).find { it.id == id }
    }

    fun refreshTicketDetail(ticketNumber: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketNumber] ?: return@launch
                val res = RetrofitClient.instance.getTicketById(backendId)
                if (res.isSuccessful) {
                    val apiItem = res.body()?.data ?: return@launch
                    val updated = apiItem.toUiModel()
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
}

// Extensión: mapear modelo del API a modelo de UI (igual que en técnico)
private fun TicketItem.toUiModel(): TecnicoTicket {
    val assignedName = listOfNotNull(assignee?.first_name, assignee?.last_name)
        .joinToString(" ").ifBlank { assignee?.username ?: "" }
    val companyName = client_company ?: run {
        val fn = creator?.first_name
        val ln = creator?.last_name
        listOfNotNull(fn, ln).joinToString(" ")
    }

    val uiStatus = (
        when (status_id) {
            1 -> TicketStatus.PENDIENTE
            2 -> TicketStatus.PENDIENTE
            3, 4 -> TicketStatus.EN_PROCESO
            5, 6 -> TicketStatus.COMPLETADO
            7 -> TicketStatus.RECHAZADO
            else -> null
        }
    ) ?: run {
        val n = status?.name?.lowercase().orEmpty()
        when {
            n.contains("rechaz") || n.contains("reject") -> TicketStatus.RECHAZADO
            n.contains("resuel") || n.contains("cerrad") || n.contains("closed") || n.contains("resolved") -> TicketStatus.COMPLETADO
            n.contains("proceso") || n.contains("espera") || n.contains("progress") || n.contains("hold") -> TicketStatus.EN_PROCESO
            n.contains("pend") || n.contains("asign") || n.contains("assign") || n.contains("pending") -> TicketStatus.PENDIENTE
            else -> TicketStatus.PENDIENTE
        }
    }

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
    rejectionReason = reopen_reason,
        clientContact = client_contact,
        clientEmail = client_email,
        clientPhone = client_phone,
        clientDepartment = client_department,
        categoryName = category?.name
    )
}