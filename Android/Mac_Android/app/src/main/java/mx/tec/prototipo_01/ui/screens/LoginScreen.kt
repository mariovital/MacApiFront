package mx.tec.prototipo_01.ui.screens

import android.app.Activity
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import mx.tec.prototipo_01.R
import mx.tec.prototipo_01.viewmodels.LoginState
import mx.tec.prototipo_01.viewmodels.LoginViewModel
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.foundation.clickable
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.api.PasswordResetRequest
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull

@Composable
fun LoginScreen(modifier: Modifier = Modifier, navController: NavController) {
    val loginViewModel: LoginViewModel = viewModel()
    val context = LocalContext.current
    val loginState = loginViewModel.loginState

    // Estado: Recuperación de contraseña
    var showForgotDialog by remember { mutableStateOf(false) }
    var forgotEmail by remember { mutableStateOf("") }
    var forgotSending by remember { mutableStateOf(false) }
    var forgotMessage by remember { mutableStateOf<String?>(null) }

    // --- Status Bar Color ---
    val view = LocalView.current
    val statusBarColor = Color(0xFFe10600) // Original red color
    SideEffect {
        val window = (view.context as Activity).window
        window.statusBarColor = statusBarColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false // Use light icons
    }
    // ---

    // Warm-up del backend: ping ligero en background para evitar primer-request lento por cold start/DNS
    LaunchedEffect(Unit) {
        withContext(Dispatchers.IO) {
            withTimeoutOrNull(2000) {
                try { RetrofitClient.instance.authHealth() } catch (_: Exception) {}
            }
        }
    }

    LaunchedEffect(loginState) {
        when (loginState) {
            is LoginState.Success -> {
                Toast.makeText(context, "Login Exitoso", Toast.LENGTH_SHORT).show()
                val roleNorm = loginState.role.lowercase()
                val destination = when {
                    roleNorm == "tecnico" -> "tecnico_home"
                    roleNorm == "mesa_trabajo" || roleNorm == "mesa de ayuda" -> "mesa_ayuda_home"
                    roleNorm == "admin" -> "mesa_ayuda_home" // no hay home de admin aún; usa mesa_ayuda
                    else -> "client_home"
                }
                navController.navigate(destination) {
                    popUpTo("login") { inclusive = true }
                }
                loginViewModel.resetLoginState()
            }
            is LoginState.Error -> {
                Toast.makeText(context, loginState.message, Toast.LENGTH_LONG).show()
                loginViewModel.resetLoginState()
            }
            else -> {}
        }
    }

    Column(modifier = modifier.fillMaxSize()) {
        val redBoxShape = RoundedCornerShape(
            topStart = 0.dp,
            topEnd = 0.dp,
            bottomEnd = 50.dp,
            bottomStart = 50.dp
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .shadow(
                    elevation = 8.dp,
                    shape = redBoxShape,
                    clip = false
                )
                .clip(redBoxShape)
                .background(Color(0xFFe10600)), // Original red color
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = R.mipmap.mac_compu),
                contentDescription = null,
                modifier = Modifier
                    .size(120.dp)
                    .offset(y = (-160).dp),
                contentScale = ContentScale.Fit
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Correo",
                modifier = Modifier
                    .offset(x = (-120).dp, y = (-50).dp),
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = loginViewModel.email,
                onValueChange = { loginViewModel.onEmailChange(it) },
                label = { Text("Correo Electrónico") },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .clip(RoundedCornerShape(percent = 50))
                    .background(Color.White),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    disabledContainerColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent,
                    focusedLabelColor = Color.Gray,
                    unfocusedLabelColor = Color.Gray,
                    focusedTextColor = Color.Black,
                    unfocusedTextColor = Color.Black
                )
            )
            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Contraseña",
                modifier = Modifier
                    .offset(x = (-120).dp, y = (70).dp),
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = loginViewModel.password,
                onValueChange = { loginViewModel.onPasswordChange(it) },
                label = { Text("Contraseña") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier
                    .offset(x = (0).dp, y = (120).dp)
                    .fillMaxWidth(0.85f)
                    .clip(RoundedCornerShape(percent = 50))
                    .background(Color.White),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    disabledContainerColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent,
                    focusedLabelColor = Color.Gray,
                    unfocusedLabelColor = Color.Gray,
                    focusedTextColor = Color.Black,
                    unfocusedTextColor = Color.Black
                )
            )
            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "¿Olvidaste tu contraseña?",
                modifier = Modifier
                    .offset(x = (0).dp, y = (170).dp)
                    .clickable { 
                        forgotEmail = loginViewModel.email
                        showForgotDialog = true 
                    },
                color = Color.White,
                style = androidx.compose.ui.text.TextStyle(textDecoration = TextDecoration.Underline)
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(.5f)
                .background(Color.White) // Original white background
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            Button(
                onClick = { loginViewModel.login() },
                enabled = loginState != LoginState.Loading,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.DarkGray, // Original button color
                    contentColor = Color.White
                ),
                modifier = Modifier
                    .offset(y = (-80).dp)
            ) {
                if (loginState == LoginState.Loading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Iniciar Sesión")
                }
            }
        }
    }

    if (showForgotDialog) {
        AlertDialog(
            onDismissRequest = { if (!forgotSending) showForgotDialog = false },
            title = { Text("Recuperar contraseña") },
            text = {
                Column {
                    Text("Ingresa tu correo y enviaremos la solicitud al administrador.")
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = forgotEmail,
                        onValueChange = { forgotEmail = it },
                        label = { Text("Correo electrónico") },
                        singleLine = true,
                    )
                    forgotMessage?.let { msg ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(msg, color = Color.Gray)
                    }
                }
            },
            confirmButton = {
                OutlinedButton(enabled = !forgotSending, onClick = {
                    if (forgotEmail.isBlank()) {
                        forgotMessage = "Ingresa un correo válido"
                        return@OutlinedButton
                    }
                    forgotSending = true
                    forgotMessage = null
                    CoroutineScope(Dispatchers.IO).launch {
                        try {
                            val res = RetrofitClient.instance.createPasswordReset(PasswordResetRequest(email = forgotEmail.trim()))
                            val ok = res.isSuccessful
                            val bodyMsg = res.body()?.message ?: if (ok) "Solicitud enviada" else (res.errorBody()?.string() ?: "Error")
                            launch(Dispatchers.Main) {
                                forgotMessage = bodyMsg
                                if (ok) {
                                    Toast.makeText(context, "Solicitud enviada", Toast.LENGTH_SHORT).show()
                                    showForgotDialog = false
                                }
                                forgotSending = false
                            }
                        } catch (e: Exception) {
                            launch(Dispatchers.Main) {
                                forgotMessage = "Error de red"
                                forgotSending = false
                            }
                        }
                    }
                }) { Text("Enviar") }
            },
            dismissButton = {
                TextButton(enabled = !forgotSending, onClick = { showForgotDialog = false }) { Text("Cancelar") }
            }
        )
    }
}