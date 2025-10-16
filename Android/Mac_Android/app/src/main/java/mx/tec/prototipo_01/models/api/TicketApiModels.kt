package mx.tec.prototipo_01.models.api

// Modelos que reflejan el JSON del backend para tickets

data class TicketListResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketListData?
)

data class TicketListData(
    val items: List<TicketItem> = emptyList(),
    val pagination: Pagination? = null
)

data class Pagination(
    val page: Int,
    val limit: Int,
    val total: Int,
    val pages: Int
)

data class TicketItem(
    val id: Int,
    val ticket_number: String,
    val title: String,
    val description: String?,
    val reopen_reason: String? = null,
    val priority_justification: String?,
    val location: String?,
    val client_company: String?,
    val client_contact: String?,
    val client_email: String?,
    val client_phone: String?,
    val client_department: String?,
    val created_at: String?,
    val updated_at: String?,
    val resolved_at: String?,
    val closed_at: String?,
    val status_id: Int,
    val priority_id: Int?,
    val category_id: Int?,
    val assignee: RelatedUser?,
    val creator: RelatedUser?,
    val status: RelatedStatus?,
    val priority: RelatedPriority?,
    val category: RelatedCategory?
)

data class RelatedUser(
    val id: Int,
    val first_name: String?,
    val last_name: String?,
    val username: String?,
    val email: String?
)

data class RelatedStatus(
    val id: Int,
    val name: String,
    val color: String?
)

data class RelatedPriority(
    val id: Int,
    val name: String,
    val color: String?
)

data class RelatedCategory(
    val id: Int,
    val name: String,
    val color: String?
)

// Catálogos
data class CategoryDto(
    val id: Int,
    val name: String,
    val description: String?,
    val color: String?
)

data class PriorityDto(
    val id: Int,
    val name: String,
    val level: Int,
    val color: String?,
    val sla_hours: Int
)

data class CategoriesResponse(
    val success: Boolean,
    val message: String?,
    val data: List<CategoryDto>
)

data class PrioritiesResponse(
    val success: Boolean,
    val message: String?,
    val data: List<PriorityDto>
)

// Técnicos
data class TechnicianDto(
    val id: Int,
    val username: String?,
    val first_name: String?,
    val last_name: String?,
    val email: String?
)

data class TechniciansResponse(
    val success: Boolean,
    val message: String?,
    val data: List<TechnicianDto>
)

// Asignación de ticket
data class AssignTicketRequest(
    val technician_id: Int
)

data class AssignTicketResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketItem?
)

// Aceptar ticket
data class AcceptTicketResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketItem?
)

// Rechazar ticket
data class RejectTicketRequest(
    val reason: String? = null
)

data class RejectTicketResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketItem?
)

// Crear ticket
data class CreateTicketRequest(
    val title: String,
    val description: String,
    val category_id: Int?,
    val priority_id: Int?,
    val client_company: String?,
    val client_contact: String?,
    val client_email: String? = null,
    val client_phone: String? = null,
    val client_department: String? = null,
    val location: String? = null,
    val priority_justification: String? = null,
    val technician_id: Int? = null
)

data class CreateTicketResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketItem?
)

// Detalle de ticket
data class TicketDetailResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketItem?
)

// Actualizar estado
data class UpdateStatusRequest(
    val status_id: Int
)

// Adjuntos
data class TicketAttachment(
    val id: Int,
    val ticket_id: Int,
    val user_id: Int,
    val original_name: String,
    val file_name: String,
    val file_size: Long,
    val file_type: String,
    val s3_url: String,
    val s3_key: String,
    val is_image: Boolean,
    val description: String?,
    val created_at: String
)

data class AttachmentResponse(
    val success: Boolean,
    val message: String?,
    val data: TicketAttachment?
)

data class AttachmentListResponse(
    val success: Boolean,
    val data: List<TicketAttachment>
)

// Password reset request
data class PasswordResetRequest(
    val email: String
)

data class PasswordResetCreateResponse(
    val success: Boolean,
    val message: String?,
    val data: PasswordResetItem?
)

data class PasswordResetItem(
    val id: Long,
    val email: String,
    val status: String,
    val created_at: String,
    val processed_at: String?,
    val processed_by: Int?,
    val note: String?
)
