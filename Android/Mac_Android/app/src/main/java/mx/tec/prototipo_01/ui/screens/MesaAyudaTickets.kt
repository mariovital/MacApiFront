package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MesaAyudaTickets(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Tickets") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { navController.navigate("create_ticket") }) {
                Icon(Icons.Default.Add, contentDescription = "Crear ticket")
            }
        }
    ) { padding ->
        Text("Lista de tickets de Mesa de Ayuda", modifier = Modifier.padding(padding))
    }
}