package mx.tec.prototipo_01.models

data class User(
    val id: Int,
    val username: String?,
    val email: String,
    val first_name: String?,
    val last_name: String?,
    val role: String
)
