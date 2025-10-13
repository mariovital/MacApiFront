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

    // Cargar tickets desde el backend, ya filtrados por rol (JWT)
    fun loadTickets() {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getTickets(limit = 100)
                if (response.isSuccessful) {
                    val body = response.body()
                    val items = body?.data?.items ?: emptyList()
                    // Mapear a UI y separar por estado
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

    fun acceptTicket(ticketId: String) {
        // ticketId es el ticket_number en UI; necesitamos ID numérico? usamos endpoint por número a futuro.
        viewModelScope.launch {
            try {
                // Por simplicidad, recargamos lista tras aceptar
                val numericId = pendingTickets.find { it.id == ticketId }?.let { _ -> null }
                // El backend espera ID interno; como no lo tenemos aquí, pedimos lista y no usamos numericId.
                // Workaround: no-op si no tenemos mapping; futuro: incluir id interno en UI model.
                loadTickets()
            } catch (e: Exception) {
                // ignorar
            }
        }
    }

    fun rejectTicket(ticketId: String) {
        viewModelScope.launch {
            try {
                loadTickets()
            } catch (e: Exception) {
                // ignorar
            }
        }
    }

    fun closeTicket(ticketId: String) {
        val ticket = pendingTickets.find { it.id == ticketId } ?: return
        ticket.status = TicketStatus.COMPLETADO
        ticket.priority = TicketPriority.Completado.displayName
        pendingTickets.remove(ticket)
        historyTickets.add(0, ticket)
    }
}

// Extensión: mapear modelo del API a modelo de UI
private fun TicketItem.toUiModel(): TecnicoTicket {
    val assignedName = listOfNotNull(assignee?.first_name, assignee?.last_name)
        .joinToString(" ").ifBlank { assignee?.username ?: "" }
    val companyName = client_company ?: (creator?.first_name?.let { fn ->
        val ln = creator.last_name ?: ""
        "$fn $ln"
    } ?: "")

    // Mapear status_id a TicketStatus de UI
    val uiStatus = when (status_id) {
        1 -> TicketStatus.PENDIENTE
        2, 3, 4 -> TicketStatus.EN_PROCESO // Asignado/En Proceso/En Espera
        5 -> TicketStatus.COMPLETADO
        6 -> TicketStatus.COMPLETADO // Cerrar como completado en UI
        else -> TicketStatus.PENDIENTE
    }

    // Mapear prioridad
    val uiPriority = (priority?.name ?: TicketPriority.NA.displayName).let { name ->
        // Asegurar que coincida con displayName conocido, si no, usar valor crudo
        val match = TicketPriority.values().find { it.displayName.equals(name, true) }
        match?.displayName ?: name
    }

    return TecnicoTicket(
        id = ticket_number,
        title = title,
        company = companyName,
        assignedTo = assignedName,
        status = uiStatus,
        priority = uiPriority,
        description = description ?: "",
        date = created_at ?: ""
    )
}