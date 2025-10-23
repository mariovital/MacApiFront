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
import androidx.compose.runtime.saveable.rememberSaveable
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
    var nombre by rememberSaveable { mutableStateOf("") }
    var compania by rememberSaveable { mutableStateOf("") }
    var ubicacion by rememberSaveable { mutableStateOf("") }
    var descripcion by rememberSaveable { mutableStateOf("") }
    var dispositivo by rememberSaveable { mutableStateOf("") }
    var serie by rememberSaveable { mutableStateOf("") }

    var priorities by remember { mutableStateOf(listOf<PriorityDto>()) }
    var categories by remember { mutableStateOf(listOf<CategoryDto>()) }
    // Catalogo de tecnicos provisto por el ViewModel (sin Retrofit directo en UI)
    LaunchedEffect(Unit) { viewModel.loadTechnicians() }
    val technicians = viewModel.technicians
    val isLoadingTechs = viewModel.isLoadingTechnicians
    val techsError = viewModel.techniciansError
    var selectedPriorityId by rememberSaveable { mutableStateOf<Int?>(null) }
    var selectedCategoryId by rememberSaveable { mutableStateOf<Int?>(null) }
    var selectedTechnicianId by rememberSaveable { mutableStateOf<Int?>(null) }

    val selectedPriority = remember(priorities, selectedPriorityId) {
        priorities.firstOrNull { it.id == selectedPriorityId }
    }
    val selectedCategory = remember(categories, selectedCategoryId) {
        categories.firstOrNull { it.id == selectedCategoryId }
    }
    val selectedTechnician = remember(technicians, selectedTechnicianId) {
        technicians.firstOrNull { it.id == selectedTechnicianId }
    }
    LaunchedEffect(technicians) {
        if (selectedTechnicianId != null && technicians.none { it.id == selectedTechnicianId }) {
            selectedTechnicianId = null
        }
    }

    var isPriorityExpanded by remember { mutableStateOf(false) }
    var isCategoryExpanded by remember { mutableStateOf(false) }
    var isTechnicianExpanded by remember { mutableStateOf(false) }

    var mapCoordinates by remember { mutableStateOf<LatLng?>(null) }
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val cameraPositionState = rememberCameraPositionState()

    val isFormValid by remember(nombre, descripcion, selectedTechnicianId, selectedPriorityId) {
        derivedStateOf {
            nombre.isNotBlank() && descripcion.isNotBlank() && selectedTechnicianId != null && selectedPriorityId != null
        }
    }

    val view = LocalView.current
    val isDark = isSystemInDarkTheme()
    val headerColor = MaterialTheme.colorScheme.primary
    val isHardwareSelected by remember(selectedCategoryId, categories) {
        derivedStateOf {
            categories.firstOrNull { it.id == selectedCategoryId }
                ?.name
                ?.contains("hardware", ignoreCase = true) == true
        }
    }

    SideEffect {
        val window = (view.context as android.app.Activity).window
        window.statusBarColor = headerColor.toArgb()
        WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !isDark
    }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val (pResp, cResp) = withContext(Dispatchers.IO) {
                    Pair(
                        RetrofitClient.instance.getPriorities(),
                        RetrofitClient.instance.getCategories()
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
                    if (selectedCategoryId == null) {
                        selectedCategoryId = categories.firstOrNull()?.id
                    }
                } else {
                    Toast.makeText(context, "Error al cargar categorías: ${cResp.message()}", Toast.LENGTH_SHORT).show()
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

                    Dropdown(
                        label = "Prioridad",
                        expanded = isPriorityExpanded,
                        onExpandedChange = { isPriorityExpanded = it },
                        selectedValue = selectedPriority?.name ?: "",
                        options = priorities.map { it.name },
                        onSelect = { priorityName ->
                            priorities.find { it.name == priorityName }?.let { selectedPriorityId = it.id }
                        },
                        isError = selectedPriorityId == null
                    )
                    Dropdown(
                        label = "Categoría",
                        expanded = isCategoryExpanded,
                        onExpandedChange = { isCategoryExpanded = it },
                        selectedValue = selectedCategory?.name ?: "",
                        options = categories.map { it.name },
                        onSelect = { categoryName ->
                            categories.find { it.name == categoryName }?.let { selectedCategoryId = it.id }
                        }
                    )
                    Dropdown(
                        label = "Asignar tecnico",
                        expanded = isTechnicianExpanded,
                        onExpandedChange = { if (!isLoadingTechs && technicians.isNotEmpty()) isTechnicianExpanded = it },
                        selectedValue = selectedTechnician?.let { listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" } } ?: "",
                        options = technicians.map { tech -> listOfNotNull(tech.first_name, tech.last_name).joinToString(" ").ifBlank { tech.username ?: "" } },
                        onSelect = { techName ->
                            technicians.find {
                                (listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" }) == techName
                            }?.let { selectedTechnicianId = it.id }
                        },
                        isError = !isLoadingTechs && selectedTechnicianId == null
                    )
                    when {
                        isLoadingTechs -> {
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Cargando tecnicos...")
                            }
                        }
                        techsError != null && technicians.isEmpty() -> {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(techsError, color = MaterialTheme.colorScheme.error)
                        }
                    }

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
                                    category_id = selectedCategoryId,
                                    priority_id = selectedPriorityId,
                                    client_company = compania.ifBlank { null },
                                    client_contact = nombre.ifBlank { null },
                                    location = ubicacion.ifBlank { null },
                                    technician_id = selectedTechnicianId
                                )
                                try {
                                    val response = withContext(Dispatchers.IO) { RetrofitClient.instance.createTicket(request) }
                                    if (response.isSuccessful) {
                                        val assigned = response.body()?.data?.assignee != null
                                        if (assigned) {
                                            Toast.makeText(context, "Ticket creado y asignado", Toast.LENGTH_SHORT).show()
                                        } else {
                                            val createdId = response.body()?.data?.id
                                            if (createdId != null && selectedTechnicianId != null) {
                                                try {
                                                    val assignResp = withContext(Dispatchers.IO) {
                                                        RetrofitClient.instance.assignTicket(
                                                            createdId,
                                                            AssignTicketRequest(technician_id = selectedTechnicianId!!)
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

private suspend fun getCoordinatesFromAddress(context: Context, address: String): LatLng? {
    return withContext(Dispatchers.IO) {
        try {
            val geocoder = Geocoder(context)
            @Suppress("DEPRECATION")
            val addresses = geocoder.getFromLocationName(address, 1)
            if (addresses?.isNotEmpty() == true) {
                LatLng(addresses[0].latitude, addresses[0].longitude)
            } else null
        } catch (e: IOException) {
            null
        } catch (_: Exception) {
            null
        }
    }
}
