package mx.tec.prototipo_01.ui.screens

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import mx.tec.prototipo_01.ui.theme.Prototipo_01Theme

@Composable
fun MainScreen() {
    var isDark by rememberSaveable { mutableStateOf(false) }
    Prototipo_01Theme(darkTheme = isDark) {
        AppNavigation(
            isDark = isDark,
            onThemeChange = { isDark = !isDark }
        )
    }
}