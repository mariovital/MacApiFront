package mx.tec.prototipo_01.ui.screens

import android.widget.Toast
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import kotlinx.coroutines.launch
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.api.AssignTicketRequest
import mx.tec.prototipo_01.models.api.TechnicianDto
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssignTicketScreen(navController: NavController, ticketId: Int) {
    var technicians by remember { mutableStateOf(listOf<TechnicianDto>()) }
    var selected by remember { mutableStateOf<TechnicianDto?>(null) }
    var expanded by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        try {
            val resp = RetrofitClient.instance.getTechnicians()
            if (resp.isSuccessful) {
                technicians = resp.body()?.data ?: emptyList()
                selected = technicians.firstOrNull()
            }
        } catch (_: Exception) {}
    }

    Column(modifier = Modifier.padding(16.dp)) {
        ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
            TextField(
                value = selected?.let { listOfNotNull(it.first_name, it.last_name).joinToString(" ") } ?: "",
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                modifier = Modifier
                    .menuAnchor()
                    .fillMaxWidth(),
                shape = RoundedCornerShape(8.dp)
            )
            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false }
            ) {
                technicians.forEach { tech ->
                    DropdownMenuItem(
                        text = { Text(listOfNotNull(tech.first_name, tech.last_name).joinToString(" ")) },
                        onClick = {
                            selected = tech
                            expanded = false
                        }
                    )
                }
            }
        }

        Button(
            onClick = {
                val techId = selected?.id ?: return@Button
                scope.launch {
                    try {
                        val resp = RetrofitClient.instance.assignTicket(ticketId, AssignTicketRequest(technician_id = techId))
                        if (resp.isSuccessful && resp.body()?.success == true) {
                            Toast.makeText(navController.context, "Asignado", Toast.LENGTH_SHORT).show()
                            navController.popBackStack()
                        } else {
                            Toast.makeText(navController.context, "Error: ${resp.code()} ${resp.message()}", Toast.LENGTH_LONG).show()
                        }
                    } catch (e: Exception) {
                        Toast.makeText(navController.context, "Red: ${e.message}", Toast.LENGTH_LONG).show()
                    }
                }
            },
            modifier = Modifier
                .padding(top = 16.dp)
                .fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Asignar")
        }
    }
}