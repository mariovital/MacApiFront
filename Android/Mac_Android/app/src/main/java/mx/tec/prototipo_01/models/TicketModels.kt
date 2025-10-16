package mx.tec.prototipo_01.models

import androidx.compose.ui.graphics.Color

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
    COMPLETADO("Completado", Color(0xFF808080)),
    RECHAZADO("Rechazado", Color(0xFFD32F2F))      // Red for Rejected
}

enum class TicketPriority(val displayName: String, val color: Color) {
    NA("N/A", Color(0xFF69696E)),
    Baja("Baja", Color(0xFF4CAF50)),
    Media("Media", Color(0xFFFF9800)),
    Alta("Alta", Color(0xFFFF5722)),
    Crítica("Crítica", Color(0xFFF44336))
}
