package mx.tec.prototipo_01

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
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
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldColors
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import mx.tec.prototipo_01.ui.theme.Prototipo_01Theme


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Prototipo_01Theme {
                DividedScreenWithColumn() // <-- Asegúrate de llamar a esta
            }
        }
    }
}

@Composable
fun DividedScreenWithColumn(modifier: Modifier = Modifier) {
    Column(modifier = modifier.fillMaxSize()) {
        // Parte Superior (Roja)
        val redBoxShape = RoundedCornerShape(
            topStart = 0.dp,
            topEnd = 0.dp,
            bottomEnd = 50.dp, // Aumenté un poco el radio para que la sombra sea más visible
            bottomStart = 50.dp
        )
        Box(
            modifier = Modifier       // Primer argumento: el modifier
                .fillMaxWidth()
                .weight(1f)
                .shadow(
                    elevation = 8.dp,
                    shape = redBoxShape,
                    clip = false
                )
                .clip(redBoxShape)
                .background(Color.Red),
            contentAlignment = Alignment.Center // Segundo argumento: contentAlignment
        ) {
            // Contenido del Box, por ejemplo, la Image
            Image(
                painter = painterResource(id = R.mipmap.mac_compu), // Asegúrate que este recurso exista
                contentDescription = null,
                modifier = Modifier
                    .size(120.dp)
                    .offset(y = (-160).dp),
                contentScale = ContentScale.Fit
            )

            Spacer(modifier = Modifier.height(16.dp)) // Espacio entre la línea y el texto

            Text(
                text = "Correo",
                modifier = Modifier
                    .offset(x = (-120).dp, y = (-50).dp),
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp)) // Espacio entre el texto y el TextField

            var userEmail by remember { mutableStateOf(TextFieldValue("")) }
            OutlinedTextField(
                value = userEmail,
                onValueChange = { userEmail = it },
                label = { Text("Correo Electrónico") },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth(0.85f) // Un poco más ancho
                    .clip(RoundedCornerShape(percent = 50))
                    .background(Color.White), // Fondo blanco con forma muy redondeada
            )
            Spacer(modifier = Modifier.height(20.dp)) // Espacio adicional al final

            Text(
                text = "Contraseña",
                modifier = Modifier
                    .offset(x = (-120).dp, y = (70).dp),
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp)) // Espacio entre el texto y el TextField

            var userPassword by remember { mutableStateOf(TextFieldValue("")) }
            OutlinedTextField(
                value = userPassword,
                onValueChange = { userPassword = it },
                label = { Text("Contraseña") },
                singleLine = true,
                modifier = Modifier
                    .offset(x = (0).dp, y = (120).dp)
                    .fillMaxWidth(0.85f) // Un poco más ancho
                    .clip(RoundedCornerShape(percent = 50))
                    .background(Color.White), // Fondo blanco con forma muy redondeada
            )
            Spacer(modifier = Modifier.height(20.dp)) // Espacio adicional al final

            Text(
                text = "¿Olvidaste tu contraseña?",
                modifier = Modifier
                    .offset(x = (0).dp, y = (170).dp),
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp)) // Espacio entre el texto y el TextField
        }


        // Parte Inferior (Blanca)
        // Parte Inferior (Blanca) con un Botón
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(.5f) // Ocupa la mitad inferior
                .background(Color.White)
                .padding(16.dp), // Padding general para el contenido del Box blanco
            contentAlignment = Alignment.Center // Alineación base del contenido
        ) {
            val context = LocalContext.current
            Button(
                onClick = {
                    Toast.makeText(context, "Botón Personalizado Presionado", Toast.LENGTH_SHORT)
                        .show()
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.DarkGray, // Nuevo color de fondo del botón
                    contentColor = Color.White    // Nuevo color del texto del botón
                ),
                modifier = Modifier
                    // Sube el botón 20.dp desde su posición centrada
                    // Un valor 'y' negativo lo mueve hacia arriba.
                    .offset(y = (-80).dp)
            ) {
                Text("Iniciar Sesión") // Texto actualizado del botón
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DividedScreenWithColumnPreview() {
    Prototipo_01Theme {
        DividedScreenWithColumn()
    }
}

