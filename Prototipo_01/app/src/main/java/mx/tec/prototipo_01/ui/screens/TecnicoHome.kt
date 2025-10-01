package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier

@Composable
fun TecnicoHome() {
    var selectedOption by remember { mutableStateOf(0) }
    Scaffold(
        bottomBar = {
            BottomAppBar {
                NavigationBarItem(
                    selected = selectedOption == 0,
                    onClick = { selectedOption = 0 },
                    icon = { Icon(Icons.Default.Home,
                        contentDescription = "") },
                    label = { Text("Mis Tickets") }
                )
                NavigationBarItem(
                    selected = selectedOption == 1,
                    onClick = { selectedOption = 1 },
                    icon = { Icon(Icons.Default.Refresh,
                        contentDescription = "") },
                    label = { Text("Tickets pasados") }
                )
                NavigationBarItem(
                    selected = selectedOption == 2,
                    onClick = { selectedOption = 2 },
                    icon = { Icon(Icons.Default.Settings,
                        contentDescription = "") },
                    label = { Text("Configuración") }
                )
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
        ) {
            when(selectedOption) {
                0 -> TecnicoTickets()
                1 -> TecnicoHistorial()
                2 -> TecnicoConfig()
            }
        }
    }
}

