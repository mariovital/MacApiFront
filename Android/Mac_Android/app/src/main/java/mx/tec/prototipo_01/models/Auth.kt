package mx.tec.prototipo_01.models

/**
 * Body del login
 */
data class LoginRequest(
    val email: String,
    val password: String
)

/**
 * Respuesta del backend: { success, message, data: { user, token, refresh_token } }
 */
data class LoginResponse(
    val success: Boolean,
    val message: String?,
    val data: LoginData?
)

data class LoginData(
    val user: User,
    val token: String,
    val refresh_token: String
)
