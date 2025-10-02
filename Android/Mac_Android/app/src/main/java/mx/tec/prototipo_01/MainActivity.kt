package mx.tec.prototipo_01

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import mx.tec.prototipo_01.ui.screens.AppNavigation
import mx.tec.prototipo_01.ui.theme.Prototipo_01Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Prototipo_01Theme {
                AppNavigation()
            }
        }
    }
}
