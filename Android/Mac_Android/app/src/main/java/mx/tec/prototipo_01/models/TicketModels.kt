package mx.tec.prototipo_01.models

import androidx.compose.ui.graphics.Color
import mx.tec.prototipo_01.models.api.RelatedStatus
import mx.tec.prototipo_01.models.api.TicketItem

// Data classes for the ticket system
data class TecnicoTicket(
    val backendId: Int,
    val id: String,
    val title: String,
    val company: String,
    val assignedTo: String,
    var status: TicketStatus, // Changed to var to allow modification
    var priority: String,
    val description: String,
    val date: String,
    val location: String?,
    val priorityJustification: String?,
    val rejectionReason: String? = null,
    val clientContact: String? = null,
    val clientEmail: String? = null,
    val clientPhone: String? = null,
    val clientDepartment: String? = null,
    val categoryName: String? = null
)

public enum class TicketStatus(val displayName: String, val color: Color) {
    PENDIENTE("Pendiente", Color(0xFFFFBE00)),
    EN_PROCESO("En proceso", Color(0xFF43A0EE)),
    COMPLETADO("Completado", Color(0xFF25D366)), // Green for Completed
    RECHAZADO("Rechazado", Color(0xFFD32F2F))      // Red for Rejected
}

enum class TicketPriority(val displayName: String, val color: Color) {
    NA("N/A", Color(0xFF69696E)),
    Baja("Baja", Color(0xFF4CAF50)),
    Media("Media", Color(0xFFFF9800)),
    Alta("Alta", Color(0xFFFF5722)),
    Crítica("Crítica", Color(0xFFF44336))
}

// Mapper desde el modelo de API al modelo de dominio usado en la UI
fun TicketItem.toDomain(): TecnicoTicket {
    val assignedName = listOfNotNull(assignee?.first_name, assignee?.last_name)
        .joinToString(" ").ifBlank { assignee?.username ?: "" }
    return TecnicoTicket(
        backendId = id,
        id = ticket_number,
        title = title,
        company = client_company ?: "",
        assignedTo = assignedName,
        status = mapStatus(status, status_id),
        priority = priority?.name ?: TicketPriority.NA.displayName,
        description = description ?: "",
        date = created_at ?: "",
        location = location,
        priorityJustification = priority_justification,
        // El motivo de rechazo puede venir en otros endpoints; aquí no siempre está presente
        rejectionReason = null,
        clientContact = client_contact,
        clientEmail = client_email,
        clientPhone = client_phone,
        clientDepartment = client_department,
        categoryName = category?.name
    )
}

private fun mapStatus(api: RelatedStatus?, statusId: Int): TicketStatus {
    val name = api?.name?.lowercase()?.trim()
    return when {
        name == null -> when (statusId) {
            1 -> TicketStatus.PENDIENTE
            2 -> TicketStatus.EN_PROCESO
            3 -> TicketStatus.COMPLETADO
            4 -> TicketStatus.RECHAZADO
            else -> TicketStatus.PENDIENTE
        }
        name.contains("pendiente") -> TicketStatus.PENDIENTE
        name.contains("proceso") || name.contains("en_proceso") || name.contains("in progress") -> TicketStatus.EN_PROCESO
        name.contains("complet") || name.contains("resuelto") || name.contains("cerrado") -> TicketStatus.COMPLETADO
        name.contains("rechaz") -> TicketStatus.RECHAZADO
        else -> when (statusId) {
            1 -> TicketStatus.PENDIENTE
            2 -> TicketStatus.EN_PROCESO
            3 -> TicketStatus.COMPLETADO
            4 -> TicketStatus.RECHAZADO
            else -> TicketStatus.PENDIENTE
        }
    }
}
