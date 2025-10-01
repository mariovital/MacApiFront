import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import mx.tec.prototipo_01.ui.screens.LoginScreen
import mx.tec.prototipo_01.ui.screens.TecnicoHome

@Composable
fun MainScreen() {
    var isLogged by remember { mutableStateOf(false) }

    if (isLogged)
        TecnicoHome()
    else
        LoginScreen(){
            isLogged = true
        }
}