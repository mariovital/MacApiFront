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
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import mx.tec.prototipo_01.R
import mx.tec.prototipo_01.viewmodels.LoginState
import mx.tec.prototipo_01.viewmodels.LoginViewModel

@Composable
fun LoginScreen(modifier: Modifier = Modifier, navController: NavController) {
    val loginViewModel: LoginViewModel = viewModel()
    val context = LocalContext.current
    val loginState = loginViewModel.loginState

    // --- Status Bar Color ---
    val view = LocalView.current
    val statusBarColor = Color(0xFFe10600) // Original red color
    SideEffect {
        val window = (view.context as Activity).window
        window.statusBarColor = statusBarColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false // Use light icons
    }
    // ---

    LaunchedEffect(loginState) {
        when (loginState) {
            is LoginState.Success -> {
                Toast.makeText(context, "Login Exitoso", Toast.LENGTH_SHORT).show()
                val destination = when {
                    loginState.role.equals("tecnico", ignoreCase = true) -> "tecnico_home"
                    loginState.role.equals("Mesa de Ayuda", ignoreCase = true) -> "mesa_ayuda_home"
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
                    .offset(x = (0).dp, y = (170).dp),
                color = Color.White
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
}