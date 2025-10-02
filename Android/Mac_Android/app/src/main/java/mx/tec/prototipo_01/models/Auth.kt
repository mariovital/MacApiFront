package mx.tec.prototipo_01.models

/**
 * Clase de datos para enviar las credenciales en el body de la petición de login.
 */
data class LoginRequest(
    val email: String,
    val password: String
)

/**
 * Clase de datos para recibir la respuesta del servidor al hacer login.
 * Normalmente incluye un token de autenticación y los datos del usuario.
 */
data class LoginResponse(
    val token: String,
    val user: User
)
