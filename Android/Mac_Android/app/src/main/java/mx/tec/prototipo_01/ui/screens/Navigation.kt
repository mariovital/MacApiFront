package mx.tec.prototipo_01.ui.screens

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navigation
import androidx.navigation.NavType
import androidx.navigation.navArgument
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel

@Composable
fun AppNavigation(isDark: Boolean, onThemeChange: () -> Unit) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(navController = navController)
        }

        // FAQ route (global)
        composable("faq/{role}") { backStackEntry ->
            val role = backStackEntry.arguments?.getString("role") ?: ""
            FaqScreen(navController = navController, role = role)
        }

        // Nested graph for the technician flow.
        navigation(startDestination = "tecnico_main", route = "tecnico_home") {
            composable("tecnico_main") { backStackEntry ->
                val parentEntry = remember(backStackEntry) { navController.getBackStackEntry("tecnico_home") }
                val viewModel: TecnicoSharedViewModel = viewModel(parentEntry)
                TecnicoHome(
                    navController = navController,
                    viewModel = viewModel,
                    isDark = isDark,
                    onThemeChange = onThemeChange
                )
            }
            composable("tecnico_ticket_details/{id}") { backStackEntry ->
                val parentEntry = remember(backStackEntry) { navController.getBackStackEntry("tecnico_home") }
                val viewModel: TecnicoSharedViewModel = viewModel(parentEntry)
                val ticketId = backStackEntry.arguments?.getString("id")
                if (ticketId != null) {
                    TecnicoTicketDetails(
                        navController = navController,
                        viewModel = viewModel,
                        ticketId = ticketId
                    )
                }
            }
        }

        // Nested graph for the Mesa de Ayuda flow.
        navigation(startDestination = "mesa_ayuda_main", route = "mesa_ayuda_home") {
            composable("mesa_ayuda_main") { backStackEntry ->
                // Scoped ViewModel for Mesa de Ayuda
                val parentEntry = remember(backStackEntry) { navController.getBackStackEntry("mesa_ayuda_home") }
                val viewModel: MesaAyudaSharedViewModel = viewModel(parentEntry)
                MesaAyudaHome(
                    navController = navController,
                    viewModel = viewModel,
                    isDark = isDark,
                    onThemeChange = onThemeChange
                )
            }
            composable("create_ticket") { backStackEntry ->
                val parentEntry = remember(backStackEntry) { navController.getBackStackEntry("mesa_ayuda_home") }
                val viewModel: MesaAyudaSharedViewModel = viewModel(parentEntry)
                CreateTicketScreen(navController, viewModel)
            }
            // Detalles solo lectura para Mesa de Ayuda
            composable("mesa_ticket_details/{id}") { backStackEntry ->
                val parentEntry = remember(backStackEntry) { navController.getBackStackEntry("mesa_ayuda_home") }
                val viewModel: MesaAyudaSharedViewModel = viewModel(parentEntry)
                val ticketId = backStackEntry.arguments?.getString("id")
                if (ticketId != null) {
                    MesaTicketDetailsReadOnly(
                        navController = navController,
                        viewModel = viewModel,
                        ticketId = ticketId
                    )
                }
            }
            // Evidencias (comentarios y adjuntos) para Mesa de Ayuda (solo lectura)
            composable("mesa_ticket_attachments/{id}/{title}/{company}/{assignedTo}/{status}/{priority}") { backStackEntry ->
                MesaTicketAttachments(
                    navController = navController,
                    id = backStackEntry.arguments?.getString("id"),
                    title = backStackEntry.arguments?.getString("title"),
                    company = backStackEntry.arguments?.getString("company"),
                    assignedTo = backStackEntry.arguments?.getString("assignedTo"),
                    status = backStackEntry.arguments?.getString("status"),
                    priority = backStackEntry.arguments?.getString("priority")
                )
            }
            composable(
                route = "assign_ticket/{ticketId}",
                arguments = listOf(navArgument("ticketId") { type = NavType.IntType })
            ) { backStackEntry ->
                val id = backStackEntry.arguments?.getInt("ticketId") ?: return@composable
                AssignTicketScreen(navController, id)
            }
        }

        composable("tecnico_ticket_attachments/{id}/{title}/{company}/{assignedTo}/{status}/{priority}") { backStackEntry ->
            TecnicoTicketAttachments(
                navController = navController,
                id = backStackEntry.arguments?.getString("id"),
                title = backStackEntry.arguments?.getString("title"),
                company = backStackEntry.arguments?.getString("company"),
                assignedTo = backStackEntry.arguments?.getString("assignedTo"),
                status = backStackEntry.arguments?.getString("status"),
                priority = backStackEntry.arguments?.getString("priority")
            )
        }

        // Placeholder for the client home screen
        composable("client_home") {
            // TODO: Create a real ClientHomeScreen later
            Text("Client Home Screen")
        }
    }
}
