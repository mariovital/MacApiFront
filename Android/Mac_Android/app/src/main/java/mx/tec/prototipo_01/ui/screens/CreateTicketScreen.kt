package mx.tec.prototipo_01.ui.screens

import android.content.Context
import android.location.Geocoder
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.api.AssignTicketRequest
import mx.tec.prototipo_01.models.api.CategoryDto
import mx.tec.prototipo_01.models.api.CreateTicketRequest
import mx.tec.prototipo_01.models.api.PriorityDto
import mx.tec.prototipo_01.models.api.TechnicianDto
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel
import java.io.IOException

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateTicketScreen(navController: NavController, viewModel: MesaAyudaSharedViewModel) {
    var nombre by remember { mutableStateOf("") }
    var compania by remember { mutableStateOf("") }
    var ubicacion by remember { mutableStateOf("") }
    var descripcion by remember { mutableStateOf("") }
    var dispositivo by remember { mutableStateOf("") }
    var serie by remember { mutableStateOf("") }

    var priorities by remember { mutableStateOf(listOf<PriorityDto>()) }
    var categories by remember { mutableStateOf(listOf<CategoryDto>()) }
    var technicians by remember { mutableStateOf(listOf<TechnicianDto>()) }
    var selectedPriority by remember { mutableStateOf<PriorityDto?>(null) }
    var selectedCategory by remember { mutableStateOf<CategoryDto?>(null) }
    var selectedTechnician by remember { mutableStateOf<TechnicianDto?>(null) }

    var isPriorityExpanded by remember { mutableStateOf(false) }
    var isCategoryExpanded by remember { mutableStateOf(false) }
    var isTechnicianExpanded by remember { mutableStateOf(false) }

    var mapCoordinates by remember { mutableStateOf<LatLng?>(null) }
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val cameraPositionState = rememberCameraPositionState()

    val isFormValid by remember(nombre, descripcion, selectedTechnician, selectedPriority) {
        derivedStateOf {
            nombre.isNotBlank() && descripcion.isNotBlank() && selectedTechnician != null && selectedPriority != null
        }
    }

    val view = LocalView.current
    val isDark = isSystemInDarkTheme()
    val headerColor = MaterialTheme.colorScheme.primary
    val isHardwareSelected by remember(selectedCategory) {
        derivedStateOf { selectedCategory?.name?.contains("hardware", ignoreCase = true) == true }
    }

    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = headerColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !isDark
    }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val (pResp, cResp, tResp) = withContext(Dispatchers.IO) {
                    Triple(
                        RetrofitClient.instance.getPriorities(),
                        RetrofitClient.instance.getCategories(),
                        RetrofitClient.instance.getTechnicians()
                    )
                }
                if (pResp.isSuccessful) {
                    priorities = pResp.body()?.data ?: emptyList()
                    // Do not autoselect, let the user choose.
                } else {
                    Toast.makeText(context, "Error al cargar prioridades: ${pResp.message()}", Toast.LENGTH_SHORT).show()
                }
                if (cResp.isSuccessful) {
                    categories = cResp.body()?.data ?: emptyList()
                    selectedCategory = categories.firstOrNull() // Autoselect first category
                } else {
                    Toast.makeText(context, "Error al cargar categorías: ${cResp.message()}", Toast.LENGTH_SHORT).show()
                }
                if (tResp.isSuccessful) {
                    technicians = tResp.body()?.data ?: emptyList()
                } else {
                    Toast.makeText(context, "Error al cargar técnicos: ${tResp.message()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e("CreateTicketScreen", "Fallo al cargar catálogos", e)
                Toast.makeText(context, "Error de red: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Crear Ticket", color = MaterialTheme.colorScheme.onPrimary, fontWeight = FontWeight.Medium, fontSize = 28.sp) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver atrás", tint = MaterialTheme.colorScheme.onPrimary)
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = headerColor)
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
                modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    OutlinedTextField(
                        value = nombre,
                        onValueChange = { nombre = it },
                        label = { Text("Nombre del ticket") },
                        modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                        shape = RoundedCornerShape(8.dp),
                        trailingIcon = {
                            if (nombre.isBlank()) {
                                Icon(Icons.Filled.Error, "Campo requerido", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    )
                    OutlinedTextField(value = compania, onValueChange = { compania = it }, label = { Text("Compañía") }, modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp), shape = RoundedCornerShape(8.dp))

                    Dropdown(label = "Prioridad", expanded = isPriorityExpanded, onExpandedChange = { isPriorityExpanded = it }, selectedValue = selectedPriority?.name ?: "", options = priorities.map { it.name }, onSelect = { priorityName -> priorities.find { it.name == priorityName }?.let { selectedPriority = it } }, isError = selectedPriority == null)
                    Dropdown(label = "Categoría", expanded = isCategoryExpanded, onExpandedChange = { isCategoryExpanded = it }, selectedValue = selectedCategory?.name ?: "", options = categories.map { it.name }, onSelect = { categoryName -> categories.find { it.name == categoryName }?.let { selectedCategory = it } })
                    Dropdown(
                        label = "Asignar técnico",
                        expanded = isTechnicianExpanded,
                        onExpandedChange = { isTechnicianExpanded = it },
                        selectedValue = selectedTechnician?.let { listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" } } ?: "",
                        options = technicians.map { tech -> listOfNotNull(tech.first_name, tech.last_name).joinToString(" ").ifBlank { tech.username ?: "" } },
                        onSelect = { techName -> technicians.find { (listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" }) == techName }?.let { selectedTechnician = it } },
                        isError = selectedTechnician == null
                    )

                    OutlinedTextField(value = ubicacion, onValueChange = { ubicacion = it }, label = { Text("Ubicación") }, modifier = Modifier.fillMaxWidth().padding(top = 16.dp), shape = RoundedCornerShape(8.dp), trailingIcon = { IconButton(onClick = { coroutineScope.launch { mapCoordinates = getCoordinatesFromAddress(context, ubicacion) } }) { Icon(Icons.Default.LocationOn, "Mostrar en mapa") } })
                    mapCoordinates?.let {
                        LaunchedEffect(it) { cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(it, 15f)) }
                        GoogleMap(modifier = Modifier.fillMaxWidth().height(200.dp).padding(vertical = 16.dp).clip(RoundedCornerShape(8.dp)), cameraPositionState = cameraPositionState) { Marker(state = MarkerState(position = it), title = ubicacion) }
                    }
                    OutlinedTextField(
                        value = descripcion,
                        onValueChange = { descripcion = it },
                        label = { Text("Descripción del problema") },
                        modifier = Modifier.fillMaxWidth().height(120.dp),
                        shape = RoundedCornerShape(8.dp),
                        trailingIcon = {
                            if (descripcion.isBlank()) {
                                Icon(Icons.Filled.Error, "Campo requerido", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    if (isHardwareSelected) {
                        Text("Hardware", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(bottom = 8.dp))
                        OutlinedTextField(value = dispositivo, onValueChange = { dispositivo = it }, label = { Text("Dispositivo") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp), shape = RoundedCornerShape(8.dp))
                        OutlinedTextField(value = serie, onValueChange = { serie = it }, label = { Text("Número de Serie") }, modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp), shape = RoundedCornerShape(8.dp))
                    }

                    Button(
                        onClick = {
                            coroutineScope.launch {
                                val fullDescription = buildString {
                                    if (isHardwareSelected && (dispositivo.isNotBlank() || serie.isNotBlank())) {
                                        appendLine("Hardware:")
                                        if (dispositivo.isNotBlank()) appendLine("- Dispositivo: $dispositivo")
                                        if (serie.isNotBlank()) appendLine("- S/N: $serie")
                                        appendLine()
                                    }
                                    append("Problema: ")
                                    append(descripcion)
                                }
                                val request = CreateTicketRequest(
                                    title = nombre,
                                    description = fullDescription,
                                    category_id = selectedCategory?.id,
                                    priority_id = selectedPriority?.id,
                                    client_company = compania.ifBlank { null },
                                    client_contact = nombre.ifBlank { null },
                                    location = ubicacion.ifBlank { null },
                                    technician_id = selectedTechnician?.id
                                )
                                try {
                                    val response = withContext(Dispatchers.IO) { RetrofitClient.instance.createTicket(request) }
                                    if (response.isSuccessful) {
                                        val assigned = response.body()?.data?.assignee != null
                                        if (assigned) {
                                            Toast.makeText(context, "Ticket creado y asignado", Toast.LENGTH_SHORT).show()
                                        } else {
                                            val createdId = response.body()?.data?.id
                                            if (createdId != null && selectedTechnician != null) {
                                                try {
                                                    val assignResp = withContext(Dispatchers.IO) {
                                                        RetrofitClient.instance.assignTicket(
                                                            createdId,
                                                            AssignTicketRequest(technician_id = selectedTechnician!!.id)
                                                        )
                                                    }
                                                    if (assignResp.isSuccessful) {
                                                        Toast.makeText(context, "Ticket creado y asignado", Toast.LENGTH_SHORT).show()
                                                    } else {
                                                        Toast.makeText(context, "Ticket creado, pero no se pudo asignar (${assignResp.code()})", Toast.LENGTH_LONG).show()
                                                    }
                                                } catch (e: Exception) {
                                                    Toast.makeText(context, "Ticket creado, error al asignar: ${e.message}", Toast.LENGTH_LONG).show()
                                                }
                                            } else {
                                                Toast.makeText(context, "Ticket creado", Toast.LENGTH_SHORT).show()
                                            }
                                        }
                                        navController.popBackStack()
                                        try {
                                            viewModel.loadTickets()
                                        } catch (_: Exception) { }
                                    } else {
                                        Toast.makeText(context, "Error: ${response.message()}", Toast.LENGTH_SHORT).show()
                                    }
                                } catch (e: Exception) {
                                    Toast.makeText(context, "Error de red: ${e.message}", Toast.LENGTH_LONG).show()
                                }
                            }
                        },
                        enabled = isFormValid,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                    ) {
                        Text("Crear Ticket", color = Color.White, modifier = Modifier.padding(vertical = 8.dp))
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Dropdown(
    label: String,
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    selectedValue: String,
    options: List<String>,
    onSelect: (String) -> Unit,
    isError: Boolean = false
) {
    Text(label, style = MaterialTheme.typography.bodySmall)
    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = onExpandedChange) {
        TextField(
            value = selectedValue,
            onValueChange = {},
            readOnly = true,
            trailingIcon = {
                if (isError) {
                    Icon(Icons.Filled.Error, "Campo requerido", tint = MaterialTheme.colorScheme.error)
                } else {
                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
                }
            },
            modifier = Modifier.menuAnchor().fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = ExposedDropdownMenuDefaults.textFieldColors(focusedIndicatorColor = Color.Transparent, unfocusedIndicatorColor = Color.Transparent)
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { onExpandedChange(false) }) {
            options.forEach { option ->
                DropdownMenuItem(text = { Text(option) }, onClick = { onSelect(option); onExpandedChange(false) })
            }
        }
    }
    Spacer(modifier = Modifier.height(16.dp))
}

private fun getCoordinatesFromAddress(context: Context, address: String): LatLng? {
    return try {
        val geocoder = Geocoder(context)
        @Suppress("DEPRECATION")
        val addresses = geocoder.getFromLocationName(address, 1)
        if (addresses?.isNotEmpty() == true) {
            LatLng(addresses[0].latitude, addresses[0].longitude)
        } else null
    } catch (e: IOException) {
        null
    }
}
