package mx.tec.prototipo_01.viewmodels

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.models.TicketStatus

class TecnicoSharedViewModel : ViewModel() {

    // This list will hold the tickets for the 'Mis Tickets' screen (Pendiente, En Proceso)
    val pendingTickets = mutableStateListOf<TecnicoTicket>()

    // This list will hold the tickets for the 'Historial' screen (Completado, Rechazado)
    val historyTickets = mutableStateListOf<TecnicoTicket>()

    init {
        // Initialize with the same sample data your screens were using, but now it's centralized
        loadSampleData()
    }

    private fun loadSampleData() {
        pendingTickets.addAll(listOf(
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
                title = "Falla de teclado",
                company = "Tech Solutions",
                assignedTo = "Omar Felipe",
                status = TicketStatus.EN_PROCESO,
                priority = TicketPriority.Activo.displayName,
                description = "El usuario reporta que varias teclas no responden.",
                date = ""
            )
        ))

        historyTickets.add(
            TecnicoTicket(
                id = "#10120",
                title = "Reparación de Teclado",
                company = "Tech Solutions",
                assignedTo = "Omar Felipe",
                status = TicketStatus.COMPLETADO,
                priority = TicketPriority.Completado.displayName,
                description = "El teclado ha sido reemplazado.",
                date = ""
            )
        )
    }

    fun getTicketById(id: String): TecnicoTicket? {
        // Search in both lists to find any ticket by its ID
        return (pendingTickets + historyTickets).find { it.id == id }
    }

    /**
     * Accepts a ticket. Changes its status to EN_PROCESO.
     * The ticket remains in the pending list.
     */
    fun acceptTicket(ticketId: String) {
        val ticket = pendingTickets.find { it.id == ticketId } ?: return
        ticket.status = TicketStatus.EN_PROCESO
        if (ticket.priority == TicketPriority.NA.displayName) {
            ticket.priority = TicketPriority.Activo.displayName
        }
    }

    /**
     * Rejects a ticket. Changes its status to RECHAZADO and moves it
     * from the pending list to the history list.
     */
    fun rejectTicket(ticketId: String) {
        val ticket = pendingTickets.find { it.id == ticketId } ?: return
        
        // Change status
        ticket.status = TicketStatus.RECHAZADO
        ticket.priority = TicketPriority.Rechazado.displayName
        
        // Move from pending to history
        pendingTickets.remove(ticket)
        historyTickets.add(0, ticket) // Add to the top of the history list for visibility
    }

    /**
     * Closes a ticket. Changes its status to COMPLETADO and moves it
     * from the pending list to the history list.
     */
    fun closeTicket(ticketId: String) {
        val ticket = pendingTickets.find { it.id == ticketId } ?: return

        // Change status
        ticket.status = TicketStatus.COMPLETADO
        ticket.priority = TicketPriority.Completado.displayName

        // Move from pending to history
        pendingTickets.remove(ticket)
        historyTickets.add(0, ticket)
    }
}