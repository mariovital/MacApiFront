package mx.tec.prototipo_01.viewmodels

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
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
                // Hacer I/O y mapeo fuera del hilo principal
                val result = withContext(Dispatchers.IO) {
                    val response = RetrofitClient.instance.getTickets(limit = 100)
                    if (!response.isSuccessful) return@withContext null
                    val items = response.body()?.data?.items ?: emptyList()
                    val idMap = items.associate { it.ticket_number to it.id }
                    val mapped = items.map { it.toUiModel() }
                    val pending = ArrayList<TecnicoTicket>(mapped.size)
                    val history = ArrayList<TecnicoTicket>(mapped.size)
                    for (t in mapped) {
                        when (t.status) {
                            TicketStatus.COMPLETADO -> history.add(t)
                            TicketStatus.RECHAZADO -> pending.add(t)
                            else -> pending.add(t)
                        }
                    }
                    Triple(idMap, pending, history)
                }

                // Actualizar estado en bloque en el hilo principal
                if (result == null) {
                    pendingTickets.clear()
                    historyTickets.clear()
                    return@launch
                }
                val (idMap, pending, history) = result
                ticketIdMap.clear()
                ticketIdMap.putAll(idMap)
                pendingTickets.clear()
                pendingTickets.addAll(pending)
                historyTickets.clear()
                historyTickets.addAll(history)
            } catch (_: Exception) {
                pendingTickets.clear()
                historyTickets.clear()
            }
        }
    }

    fun getTicketById(id: String): TecnicoTicket? {
        return (pendingTickets + historyTickets).find { it.id == id }
    }

    // Exponer el id interno del backend a partir del ticket_number
    fun getBackendIdByTicketNumber(ticketNumber: String): Int? = ticketIdMap[ticketNumber]

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