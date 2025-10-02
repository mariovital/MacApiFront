package mx.tec.prototipo_01.ui.screens

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen { 
                navController.navigate("tecnico_home") {
                    // Avoid multiple copies of the same destination when re-logging
                    popUpTo("login") {
                        inclusive = true
                    }
                }
            }
        }
        composable("tecnico_home") {
            TecnicoHome(navController = navController)
        }
        composable("tecnico_ticket_details/{id}/{title}/{company}/{assignedTo}/{status}/{priority}/{description}") { backStackEntry ->
            TecnicoTicketDetails(
                navController = navController,
                id = backStackEntry.arguments?.getString("id"),
                title = backStackEntry.arguments?.getString("title"),
                company = backStackEntry.arguments?.getString("company"),
                assignedTo = backStackEntry.arguments?.getString("assignedTo"),
                status = backStackEntry.arguments?.getString("status"),
                priority = backStackEntry.arguments?.getString("priority"),
                description = backStackEntry.arguments?.getString("description")
            )
        }
    }
}
