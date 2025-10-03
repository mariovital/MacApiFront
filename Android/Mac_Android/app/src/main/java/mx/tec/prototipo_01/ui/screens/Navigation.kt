package mx.tec.prototipo_01.ui.screens

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navigation
import mx.tec.prototipo_01.viewmodels.TecnicoSharedViewModel

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(navController = navController)
        }

        // Nested graph for the technician flow. The ViewModel is scoped to this graph,
        // so all screens within it (home, details) share the same instance.
        navigation(startDestination = "tecnico_main", route = "tecnico_home") {

            composable("tecnico_main") { backStackEntry ->
                // Get the back stack entry for the parent navigation graph
                val parentEntry = remember(backStackEntry) { navController.getBackStackEntry("tecnico_home") }
                // Pass that entry to viewModel() to get a shared instance
                val viewModel: TecnicoSharedViewModel = viewModel(parentEntry)

                TecnicoHome(navController = navController, viewModel = viewModel)
            }

            composable("tecnico_ticket_details/{id}") { backStackEntry ->
                // Do the same here to get the *same* shared instance
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

        composable("tecnico_ticket_chat/{id}/{title}/{company}/{assignedTo}/{status}/{priority}") { backStackEntry ->
            TecnicoTicketChat(
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