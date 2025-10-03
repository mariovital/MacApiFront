package mx.tec.prototipo_01.viewmodels

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.LoginRequest

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
        // --- INICIO: CÓDIGO DE PRUEBA LOCAL (SIN CONEXIÓN) ---
        viewModelScope.launch {
            loginState = LoginState.Loading
            delay(1000) // Simula un pequeño retraso de red

            when {
                email.equals("admin@test.com", ignoreCase = true) -> {
                    // Simula un login exitoso para el rol de Administrador
                    loginState = LoginState.Success("Admin")
                }
                email.equals("tech@test.com", ignoreCase = true) -> {
                    // Simula un login exitoso para el rol de Técnico
                    loginState = LoginState.Success("tecnico")
                }
                else -> {
                    // Para cualquier otro email, simula un error de credenciales
                    loginState = LoginState.Error("Credenciales de prueba incorrectas.")
                }
            }
        }

        /* DESCOMENTAR CUANDO SE CONECTE A AWS
        viewModelScope.launch {
            loginState = LoginState.Loading
            try {
                val request = LoginRequest(email, password)
                val response = RetrofitClient.instance.login(request)

                if (response.isSuccessful && response.body() != null) {
                    val userRole = response.body()!!.user.role
                    loginState = LoginState.Success(userRole)
                } else {
                    loginState = LoginState.Error("Credenciales incorrectas. Inténtalo de nuevo.")
                }
            } catch (e: Exception) {
                Log.e("LoginViewModel", "Error de red: ${e.message}")
                loginState = LoginState.Error("Error de red: ${e.message}")
            }
        } */
    }

    fun resetLoginState() {
        loginState = LoginState.Idle
    }
}