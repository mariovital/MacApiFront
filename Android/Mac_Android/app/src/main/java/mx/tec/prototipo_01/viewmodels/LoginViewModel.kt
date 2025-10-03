package mx.tec.prototipo_01.viewmodels

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
        // Basic hardcoded validation
        if (email == "test@test.com" && password == "1234") {
            loginState = LoginState.Success("tecnico")
        } else {
            loginState = LoginState.Error("Credenciales incorrectas")
        }

        // --- REAL NETWORK REQUEST (Commented out for now) ---
        /*
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
                loginState = LoginState.Error("Error de red: ${e.message}")
            }
        }
        */
    }

    // Resets the login state to Idle
    fun resetLoginState() {
        loginState = LoginState.Idle
    }
}