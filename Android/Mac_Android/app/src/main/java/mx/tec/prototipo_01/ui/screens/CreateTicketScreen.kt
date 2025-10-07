package mx.tec.prototipo_01.ui.screens

import android.content.Context
import android.location.Geocoder
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.navigation.NavController
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel
import java.io.IOException

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateTicketScreen(navController: NavController, viewModel: MesaAyudaSharedViewModel) {
    var nombre by remember { mutableStateOf("") }
    var compania by remember { mutableStateOf("") }
    var ubicacion by remember { mutableStateOf("") }
    var descripcion by remember { mutableStateOf("") }
    val priorities = listOf("Baja", "Media", "Alta")
    var selectedPriority by remember { mutableStateOf(priorities[0]) }
    val technicians = listOf("Juan Perez", "Maria Lopez", "Carlos Sanchez")
    var selectedTechnician by remember { mutableStateOf(technicians[0]) }
    var isPriorityExpanded by remember { mutableStateOf(false) }
    var isTechnicianExpanded by remember { mutableStateOf(false) }
    var mapCoordinates by remember { mutableStateOf<LatLng?>(null) }
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val cameraPositionState = rememberCameraPositionState()

    val view = LocalView.current
    val headerColor = Color(0xFF424242)

    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = headerColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
    }

    Scaffold(
        containerColor = Color(0xFFCFE3F3),
        topBar = {
            CenterAlignedTopAppBar(
                modifier = Modifier.clip(RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp)),
                title = {
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(text = "Crear Ticket", color = Color.White, fontWeight = FontWeight.Medium, fontSize = 28.sp)
                        Box(
                            modifier = Modifier
                                .padding(start = 4.dp, bottom = 6.dp)
                                .size(7.dp)
                                .background(color = Color(0xFFe10600), shape = CircleShape)
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = headerColor
                )
            )
        },
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color.White
                )
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text("Nombre", style = MaterialTheme.typography.bodySmall)
                    OutlinedTextField(
                        value = nombre,
                        onValueChange = { nombre = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        shape = RoundedCornerShape(8.dp)
                    )

                    Text("Compañía", style = MaterialTheme.typography.bodySmall)
                    OutlinedTextField(
                        value = compania,
                        onValueChange = { compania = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        shape = RoundedCornerShape(8.dp)
                    )

                    Text("Ubicación", style = MaterialTheme.typography.bodySmall)
                    OutlinedTextField(
                        value = ubicacion,
                        onValueChange = { ubicacion = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        shape = RoundedCornerShape(8.dp),
                        trailingIcon = {
                            IconButton(onClick = {
                                coroutineScope.launch {
                                    val coordinates = withContext(Dispatchers.IO) {
                                        getCoordinatesFromAddress(context, ubicacion)
                                    }
                                    mapCoordinates = coordinates
                                }
                            }) {
                                Icon(Icons.Default.LocationOn, contentDescription = "Mostrar en mapa")
                            }
                        }
                    )

                    mapCoordinates?.let { coords ->
                        LaunchedEffect(coords) {
                            cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(coords, 15f))
                        }
                        GoogleMap(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                                .padding(bottom = 16.dp)
                                .clip(RoundedCornerShape(8.dp)),
                            cameraPositionState = cameraPositionState
                        ) {
                            Marker(state = MarkerState(position = coords), title = ubicacion)
                        }
                    }

                    Text("Prioridad", style = MaterialTheme.typography.bodySmall)
                    ExposedDropdownMenuBox(
                        expanded = isPriorityExpanded,
                        onExpandedChange = { isPriorityExpanded = it }
                    ) {
                        TextField(
                            value = selectedPriority,
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isPriorityExpanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp),
                            colors = ExposedDropdownMenuDefaults.textFieldColors(
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent
                            )
                        )
                        ExposedDropdownMenu(
                            expanded = isPriorityExpanded,
                            onDismissRequest = { isPriorityExpanded = false }
                        ) {
                            priorities.forEach { priority ->
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text(priority) },
                                    onClick = {
                                        selectedPriority = priority
                                        isPriorityExpanded = false
                                    }
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    Text("Asignar a técnico:", style = MaterialTheme.typography.bodySmall)
                    ExposedDropdownMenuBox(
                        expanded = isTechnicianExpanded,
                        onExpandedChange = { isTechnicianExpanded = it }
                    ) {
                        TextField(
                            value = selectedTechnician,
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isTechnicianExpanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp),
                            colors = ExposedDropdownMenuDefaults.textFieldColors(
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent
                            )
                        )
                        ExposedDropdownMenu(
                            expanded = isTechnicianExpanded,
                            onDismissRequest = { isTechnicianExpanded = false }
                        ) {
                            technicians.forEach { technician ->
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text(technician) },
                                    onClick = {
                                        selectedTechnician = technician
                                        isTechnicianExpanded = false
                                    }
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    Text("Descripción", style = MaterialTheme.typography.bodySmall)
                    OutlinedTextField(
                        value = descripcion,
                        onValueChange = { descripcion = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(120.dp),
                        shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(24.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        OutlinedButton(
                            onClick = { navController.popBackStack() },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Cancelar")
                        }
                        Button(
                            onClick = {
                                navController.popBackStack()
                            },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF5C6BC0)
                            ),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(text = "Aceptar", color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

private fun getCoordinatesFromAddress(context: Context, address: String): LatLng? {
    return try {
        val geocoder = Geocoder(context)
        val addresses = geocoder.getFromLocationName(address, 1)
        if (addresses?.isNotEmpty() == true) {
            val location = addresses[0]
            LatLng(location.latitude, location.longitude)
        } else {
            null
        }
    } catch (e: IOException) {
        e.printStackTrace()
        null
    }
}
