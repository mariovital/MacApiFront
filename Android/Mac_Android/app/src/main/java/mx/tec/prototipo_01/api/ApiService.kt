package mx.tec.prototipo_01.api

import mx.tec.prototipo_01.models.LoginRequest
import mx.tec.prototipo_01.models.LoginResponse
import mx.tec.prototipo_01.models.api.CreateTicketRequest
import mx.tec.prototipo_01.models.api.CreateTicketResponse
import mx.tec.prototipo_01.models.api.CategoriesResponse
import mx.tec.prototipo_01.models.api.PrioritiesResponse
import mx.tec.prototipo_01.models.api.TechniciansResponse
import mx.tec.prototipo_01.models.api.TicketDetailResponse
import mx.tec.prototipo_01.models.api.AssignTicketRequest
import mx.tec.prototipo_01.models.api.AssignTicketResponse
import mx.tec.prototipo_01.models.api.TicketListResponse
import mx.tec.prototipo_01.models.api.AcceptTicketResponse
import mx.tec.prototipo_01.models.api.RejectTicketRequest
import mx.tec.prototipo_01.models.api.RejectTicketResponse
import mx.tec.prototipo_01.models.api.AttachmentResponse
import mx.tec.prototipo_01.models.api.AttachmentListResponse
import mx.tec.prototipo_01.models.api.PasswordResetRequest
import mx.tec.prototipo_01.models.api.PasswordResetCreateResponse
import mx.tec.prototipo_01.models.api.CommentListResponse
import mx.tec.prototipo_01.models.api.CreateCommentRequest
import mx.tec.prototipo_01.models.api.CreateCommentResponse
import mx.tec.prototipo_01.models.api.UpdateStatusRequest
import mx.tec.prototipo_01.models.api.UpdateTicketRequest
import mx.tec.prototipo_01.models.api.UpdateCommentRequest
import mx.tec.prototipo_01.models.api.SimpleResponse
import mx.tec.prototipo_01.models.api.StatusesResponse
import mx.tec.prototipo_01.models.api.RolesResponse
import mx.tec.prototipo_01.models.api.PasswordResetVerifyRequest
import mx.tec.prototipo_01.models.api.PasswordResetVerifyResponse
import mx.tec.prototipo_01.models.api.PasswordDoResetRequest
import mx.tec.prototipo_01.models.api.PasswordDoResetResponse
import mx.tec.prototipo_01.models.api.AuthRefreshRequest
import mx.tec.prototipo_01.models.api.AuthRefreshResponse
import mx.tec.prototipo_01.models.api.PdfTicketResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.DELETE
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Multipart
import retrofit2.http.Part
import okhttp3.MultipartBody
import mx.tec.prototipo_01.models.api.ResolveTicketRequest
import mx.tec.prototipo_01.models.api.CloseTicketRequest

/**
 * Interfaz que define las rutas del API para Retrofit.
 * Cada función corresponde a una de las rutas de tu archivo users.js.
 */
interface ApiService {

    // =====================================================================
    // RUTAS DE AUTENTICACIÓN
    // =====================================================================

    // POST /api/auth/login
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    // POST /api/auth/refresh
    @POST("auth/refresh")
    suspend fun refresh(@Body request: AuthRefreshRequest): Response<AuthRefreshResponse>

    // POST /api/auth/logout
    @POST("auth/logout")
    suspend fun logout(): Response<SimpleResponse>

    // =====================================================================
    // RUTAS DE USUARIOS
    // =====================================================================

    // Olvidaste tu contraseña: crear solicitud
    @POST("password-resets")
    suspend fun createPasswordReset(@Body body: PasswordResetRequest): Response<PasswordResetCreateResponse>

    // POST /api/password-resets/verify
    @POST("password-resets/verify")
    suspend fun verifyPasswordReset(@Body body: PasswordResetVerifyRequest): Response<PasswordResetVerifyResponse>

    // POST /api/password-resets/reset
    @POST("password-resets/reset")
    suspend fun resetPassword(@Body body: PasswordDoResetRequest): Response<PasswordDoResetResponse>

    // =====================================================================
    // RUTAS DE TICKETS
    // =====================================================================

    // GET /api/tickets
    // El backend ya filtra por rol (técnico verá sólo asignados)
    @GET("tickets")
    suspend fun getTickets(
        @Query("page") page: Int? = null,
        @Query("limit") limit: Int? = null,
        @Query("status") status: Int? = null
    ): Response<TicketListResponse>

    // POST /api/tickets
    @POST("tickets")
    suspend fun createTicket(@Body body: CreateTicketRequest): Response<CreateTicketResponse>

    // GET /api/tickets/{id}
    @GET("tickets/{id}")
    suspend fun getTicketById(@Path("id") ticketId: Int): Response<TicketDetailResponse>

    // PUT /api/tickets/{id}
    @PUT("tickets/{id}")
    suspend fun updateTicket(@Path("id") ticketId: Int, @Body body: UpdateTicketRequest): Response<TicketDetailResponse>

    // DELETE /api/tickets/{id}
    @DELETE("tickets/{id}")
    suspend fun deleteTicket(@Path("id") ticketId: Int): Response<SimpleResponse>

    // PATCH /api/tickets/{id}/status
    @PATCH("tickets/{id}/status")
    suspend fun updateTicketStatus(@Path("id") ticketId: Int, @Body body: UpdateStatusRequest): Response<TicketDetailResponse>

    // =====================================================================
    // CATÁLOGOS
    // =====================================================================
    @GET("catalog/categories")
    suspend fun getCategories(): Response<CategoriesResponse>

    @GET("catalog/priorities")
    suspend fun getPriorities(): Response<PrioritiesResponse>

    @GET("catalog/technicians")
    suspend fun getTechnicians(): Response<TechniciansResponse>

    @POST("tickets/{id}/assign")
    suspend fun assignTicket(@Path("id") ticketId: Int, @Body body: AssignTicketRequest): Response<AssignTicketResponse>

    // Aceptar ticket (técnico)
    @POST("tickets/{id}/accept")
    suspend fun acceptTicket(@Path("id") ticketId: Int): Response<AcceptTicketResponse>

    // Rechazar ticket (técnico)
    @POST("tickets/{id}/reject")
    suspend fun rejectTicket(@Path("id") ticketId: Int, @Body body: RejectTicketRequest): Response<RejectTicketResponse>


    // Marcar ticket como resuelto (técnico)
    // Marcar ticket como resuelto (técnico) con comentario obligatorio
    @POST("tickets/{id}/resolve")
    suspend fun resolveTicket(@Path("id") ticketId: Int, @Body body: ResolveTicketRequest): Response<TicketDetailResponse>

    // POST /api/tickets/{id}/close
    @POST("tickets/{id}/close")
    suspend fun closeTicket(@Path("id") ticketId: Int, @Body body: CloseTicketRequest): Response<TicketDetailResponse>

    // POST /api/tickets/{id}/reopen
    @POST("tickets/{id}/reopen")
    suspend fun reopenTicket(@Path("id") ticketId: Int): Response<TicketDetailResponse>

    // =====================================================================
    // COMENTARIOS
    // =====================================================================
    @GET("tickets/{ticketId}/comments")
    suspend fun getTicketComments(@Path("ticketId") ticketId: Int): Response<CommentListResponse>

    @POST("tickets/{ticketId}/comments")
    suspend fun addTicketComment(@Path("ticketId") ticketId: Int, @Body body: CreateCommentRequest): Response<CreateCommentResponse>

    // PUT /api/tickets/{ticketId}/comments/{commentId}
    @PUT("tickets/{ticketId}/comments/{commentId}")
    suspend fun updateTicketComment(
        @Path("ticketId") ticketId: Int,
        @Path("commentId") commentId: Int,
        @Body body: UpdateCommentRequest
    ): Response<CreateCommentResponse>

    // DELETE /api/tickets/{ticketId}/comments/{commentId}
    @DELETE("tickets/{ticketId}/comments/{commentId}")
    suspend fun deleteTicketComment(
        @Path("ticketId") ticketId: Int,
        @Path("commentId") commentId: Int
    ): Response<SimpleResponse>

    // =====================================================================
    // ADJUNTOS
    // =====================================================================
    
    @Multipart
    @POST("tickets/{id}/attachments")
    suspend fun uploadAttachment(@Path("id") ticketId: Int, @Part file: MultipartBody.Part): Response<AttachmentResponse>

    @GET("tickets/{id}/attachments")
    suspend fun listAttachments(@Path("id") ticketId: Int): Response<AttachmentListResponse>

    // POST /api/tickets/{id}/attachments/multiple
    @Multipart
    @POST("tickets/{id}/attachments/multiple")
    suspend fun uploadMultipleAttachments(
        @Path("id") ticketId: Int,
        @Part files: List<MultipartBody.Part>
    ): Response<AttachmentListResponse>

    // DELETE /api/attachments/{attachmentId}
    @DELETE("attachments/{attachmentId}")
    suspend fun deleteAttachment(@Path("attachmentId") attachmentId: Int): Response<SimpleResponse>

    // GET /api/attachments/{attachmentId}/download
    @GET("attachments/{attachmentId}/download")
    suspend fun downloadAttachment(@Path("attachmentId") attachmentId: Int): Response<okhttp3.ResponseBody>

    // =====================================================================
    // CATÁLOGOS ADICIONALES
    // =====================================================================
    @GET("catalog/statuses")
    suspend fun getStatuses(): Response<StatusesResponse>

    @GET("catalog/roles")
    suspend fun getRoles(): Response<RolesResponse>

    // =====================================================================
    // REPORTES / PDF
    // =====================================================================
    @GET("pdf/ticket/{ticketId}")
    suspend fun getTicketPdf(@Path("ticketId") ticketId: Int): Response<PdfTicketResponse>
}
