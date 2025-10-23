package mx.tec.prototipo_01.viewmodels

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.auth.TokenStore
import mx.tec.prototipo_01.models.LoginRequest
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// Simple data class to hold the error response from the API
data class ErrorResponse(val message: String)

// Represents the different states of the Login screen
sealed class LoginState {
    object Idle : LoginState()
    object Loading : LoginState()
    data class Success(val role: String) : LoginState()
    data class Error(val message: String) : LoginState()
}

class LoginViewModel : ViewModel() {

    // Holds the current state of the email field
    var email by mutableStateOf("")
        private set

    // Holds the current state of the password field
    var password by mutableStateOf("")
        private set

    // Holds the current state of the login process (e.g., loading, success, error)
    var loginState: LoginState by mutableStateOf(LoginState.Idle)
        private set

    // Updates the email value
    fun onEmailChange(newEmail: String) {
        email = newEmail
    }

    // Updates the password value
    fun onPasswordChange(newPassword: String) {
        password = newPassword
    }

    // Performs the login operation
    fun login() {
    viewModelScope.launch {
            loginState = LoginState.Loading
            try {
                // Normalizar entradas
                val normalizedEmail = email.trim().lowercase()
                val normalizedPassword = password.trim()

                val request = LoginRequest(email = normalizedEmail, password = normalizedPassword)
        val response = withContext(Dispatchers.IO) { RetrofitClient.instance.login(request) }

                if (response.isSuccessful) {
                    val body = response.body()
                    if (body?.success == true && body.data != null) {
                        val token = body.data.token
                        val refresh = body.data.refresh_token
                        val role = body.data.user.role
                        // Guardar token en memoria
                        TokenStore.save(token, refresh)
                        loginState = LoginState.Success(role)
                    } else {
                        loginState = LoginState.Error(body?.message ?: "Credenciales incorrectas.")
                    }
                } else {
                    // Intentar leer mensaje del backend { success, message, code }
                    val errorMsg = try {
                        val errBody = response.errorBody()?.string()
                        if (!errBody.isNullOrBlank()) {
                            val errorResponse = Gson().fromJson(errBody, ErrorResponse::class.java)
                            errorResponse.message
                        } else null
                    } catch (e: Exception) { null }

                    val message = when (response.code()) {
                        401 -> errorMsg ?: "Credenciales inválidas o cuenta bloqueada."
                        429 -> "Demasiados intentos. Intenta más tarde."
                        else -> errorMsg ?: "Error ${response.code()} al iniciar sesión."
                    }
                    loginState = LoginState.Error(message)
                }
            } catch (e: Exception) {
                Log.e("LoginViewModel", "Error de red: ${e.message}")
                loginState = LoginState.Error("Error de red: ${e.message}")
            }
        }
    }

    fun resetLoginState() {
        loginState = LoginState.Idle
    }
}
