package mx.tec.prototipo_01.api

import mx.tec.prototipo_01.models.LoginRequest
import mx.tec.prototipo_01.models.LoginResponse
import mx.tec.prototipo_01.models.User
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
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

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

    // GET /api/auth/profile
    @GET("auth/profile")
    suspend fun getProfile(): Response<User>

    // POST /api/auth/logout
    @POST("auth/logout")
    suspend fun logout(): Response<Void>

    // =====================================================================
    // RUTAS DE USUARIOS
    // =====================================================================

    // GET /api/users
    @GET("users")
    suspend fun getUsers(): Response<List<User>>

    // GET /api/users/:id
    @GET("users/{id}")
    suspend fun getUserById(@Path("id") userId: Int): Response<User>

    // POST /api/users
    @POST("users")
    suspend fun createUser(@Body user: User): Response<User>

    // PUT /api/users/:id
    @PUT("users/{id}")
    suspend fun updateUser(@Path("id") userId: Int, @Body user: User): Response<User>

    // DELETE /api/users/:id
    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") userId: Int): Response<Void>

    // POST /api/users/:id/reset-password
    @POST("users/{id}/reset-password")
    suspend fun resetPassword(@Path("id") userId: Int): Response<Void>

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

    // =====================================================================
    // CATÁLOGOS
    // =====================================================================
    @GET("categories")
    suspend fun getCategories(): Response<CategoriesResponse>

    @GET("priorities")
    suspend fun getPriorities(): Response<PrioritiesResponse>

    @GET("technicians")
    suspend fun getTechnicians(): Response<TechniciansResponse>

    @POST("tickets/{id}/assign")
    suspend fun assignTicket(@Path("id") ticketId: Int, @Body body: AssignTicketRequest): Response<AssignTicketResponse>

    // Aceptar ticket (técnico)
    @POST("tickets/{id}/accept")
    suspend fun acceptTicket(@Path("id") ticketId: Int): Response<AcceptTicketResponse>

    // Rechazar ticket (técnico)
    @POST("tickets/{id}/reject")
    suspend fun rejectTicket(@Path("id") ticketId: Int, @Body body: RejectTicketRequest): Response<RejectTicketResponse>
}
