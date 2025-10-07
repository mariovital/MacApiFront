package mx.tec.prototipo_01.models

import androidx.compose.ui.graphics.Color

// Data classes for the ticket system
data class TecnicoTicket(
    val id: String,
    val title: String,
    val company: String,
    val assignedTo: String,
    var status: TicketStatus, // Changed to var to allow modification
    val priority: String,
    val description: String,
    val date: String
)

public enum class TicketStatus(val displayName: String, val color: Color) {
    PENDIENTE("Pendiente", Color(0xFFFFBE00)),
    EN_PROCESO("En proceso", Color(0xFF43A0EE)),
    COMPLETADO("Completado", Color(0xFF808080)),
    RECHAZADO("Rechazado", Color(0xFFD32F2F))      // Red for Rejected
}

enum class TicketPriority(val displayName: String, val color: Color) {
    NA("N/A", Color(0xFF69696E)),
    Activo("Activo", Color(0xFF1EC40A)),
    Completado("Completado", Color(0xFFF50D0D))
}
