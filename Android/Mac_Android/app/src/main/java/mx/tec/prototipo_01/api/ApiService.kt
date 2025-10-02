package mx.tec.prototipo_01.api

import mx.tec.prototipo_01.models.LoginRequest
import mx.tec.prototipo_01.models.LoginResponse
import mx.tec.prototipo_01.models.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

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
}
