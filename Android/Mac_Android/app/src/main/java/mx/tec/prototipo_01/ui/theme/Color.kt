package mx.tec.prototipo_01.ui.theme

import androidx.compose.ui.graphics.Color

// MacApi Colors
val MacRed = Color(0xFFe10600)
val ButtonBlue = Color(0xFF1976D2)
val LightGray = Color(0xFFCFD8DC) // App background
val DarkGray = Color(0xFF424242)   // Original header color
val TextGray = Color(0xFF616161)

// --- Swapped Header Colors ---

// Light Theme (Modo Día)
val LightPrimary = DarkGray            // Header color (Negro)
val LightOnPrimary = Color.White       // Header text color (Blanco)
val LightSecondary = ButtonBlue
val LightOnSecondary = Color.White
val LightError = MacRed
val LightBackground = LightGray
val LightSurface = Color.White

// Dark Theme (Modo Noche)
val DarkPrimary = Color(0xFFD9D9D9)      // Header color (Gris claro)
val DarkOnPrimary = Color(0xFF242424)      // Header text color (Negro)
val DarkSecondary = ButtonBlue
val DarkOnSecondary = Color.White
val DarkError = MacRed
val DarkBackground = Color.Black
val DarkSurface = Color(0xFF212121)