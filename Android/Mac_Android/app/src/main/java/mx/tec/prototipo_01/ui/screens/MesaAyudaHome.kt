package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.navigation.NavController
import kotlinx.coroutines.flow.collect
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MesaAyudaHome(
    navController: NavController,
    viewModel: MesaAyudaSharedViewModel,
    isDark: Boolean,
    onThemeChange: () -> Unit
) {
    var selectedOption by rememberSaveable { mutableStateOf(0) }

    val view = LocalView.current
    val headerColor = MaterialTheme.colorScheme.primary

    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = headerColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !isDark
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            CenterAlignedTopAppBar(
                modifier = Modifier.clip(RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp)),
                title = {
                    val titleText = when (selectedOption) {
                        0 -> "Tickets"
                        1 -> "Tickets pasados"
                        2 -> "Configuración"
                        else -> ""
                    }
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(text = titleText, color = MaterialTheme.colorScheme.onPrimary, fontWeight = FontWeight.Medium, fontSize = 28.sp)
                        Box(
                            modifier = Modifier
                                .padding(start = 4.dp, bottom = 4.dp)
                                .size(7.dp)
                                .background(color = MaterialTheme.colorScheme.error, shape = CircleShape)
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = headerColor
                )
            )
        },
        bottomBar = {
            BottomAppBar {
                NavigationBarItem(
                    selected = selectedOption == 0,
                    onClick = { selectedOption = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Tickets") },
                    label = { Text("Tickets") }
                )
                NavigationBarItem(
                    selected = selectedOption == 1,
                    onClick = { selectedOption = 1 },
                    icon = { Icon(Icons.Default.Refresh, contentDescription = "Tickets pasados") },
                    label = { Text("Tickets pasados") }
                )
                NavigationBarItem(
                    selected = selectedOption == 2,
                    onClick = { selectedOption = 2 },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Configuración") },
                    label = { Text("Configuración") }
                )
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            androidx.compose.runtime.LaunchedEffect(navController) {
                navController.currentBackStackEntryFlow.collect { entry ->
                    entry.savedStateHandle.get<Int>("mesa_select_tab")?.let { tab ->
                        if (tab == 0) selectedOption = 0
                        entry.savedStateHandle.remove<Int>("mesa_select_tab")
                    }
                }
            }
            androidx.compose.runtime.LaunchedEffect(selectedOption) {
                if (selectedOption == 0 || selectedOption == 1) {
                    viewModel.loadTickets()
                }
            }
            when(selectedOption) {
                0 -> MesaAyudaTickets(navController = navController, viewModel = viewModel, isDark = isDark)
                1 -> MesaAyudaHistorial(navController = navController, viewModel = viewModel)
                2 -> MesaAyudaConfig(
                    navController = navController,
                    onThemeToggle = onThemeChange,
                    onLogout = {
                        navController.navigate("login") {
                            popUpTo("mesa_ayuda_home") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
