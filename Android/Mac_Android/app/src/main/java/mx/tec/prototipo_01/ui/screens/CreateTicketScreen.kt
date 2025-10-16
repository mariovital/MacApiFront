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
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.viewmodels.MesaAyudaSharedViewModel
import mx.tec.prototipo_01.models.api.CreateTicketRequest
import mx.tec.prototipo_01.models.api.CategoryDto
import mx.tec.prototipo_01.models.api.PriorityDto
import mx.tec.prototipo_01.models.api.TechnicianDto
import mx.tec.prototipo_01.models.api.AssignTicketRequest
import android.widget.Toast
import java.io.IOException

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateTicketScreen(navController: NavController, viewModel: MesaAyudaSharedViewModel) {
    var nombre by remember { mutableStateOf("") }
    var compania by remember { mutableStateOf("") }
    var ubicacion by remember { mutableStateOf("") }
    var descripcion by remember { mutableStateOf("") }
    // Hardware (opcional)
    var dispositivo by remember { mutableStateOf("") }
    var serie by remember { mutableStateOf("") }
    // Catálogos reales desde backend
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
        // Cargar catálogos al entrar
        LaunchedEffect(Unit) {
            try {
                val (pResp, cResp, tResp) = withContext(Dispatchers.IO) {
                    val pr = RetrofitClient.instance.getPriorities()
                    val cr = RetrofitClient.instance.getCategories()
                    val tr = RetrofitClient.instance.getTechnicians()
                    Triple(pr, cr, tr)
                }
                if (pResp.isSuccessful) {
                    priorities = pResp.body()?.data ?: emptyList()
                    selectedPriority = priorities.firstOrNull()
                }
                if (cResp.isSuccessful) {
                    categories = cResp.body()?.data ?: emptyList()
                    selectedCategory = categories.firstOrNull()
                }
                if (tResp.isSuccessful) {
                    technicians = tResp.body()?.data ?: emptyList()
                    // No seleccionamos técnico por defecto; es opcional
                }
            } catch (_: Exception) { /* silencioso */ }
        }
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
                            value = selectedPriority?.name ?: "",
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
                                    text = { Text(priority.name) },
                                    onClick = {
                                        selectedPriority = priority
                                        isPriorityExpanded = false
                                    }
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    Text("Categoría", style = MaterialTheme.typography.bodySmall)
                    ExposedDropdownMenuBox(
                        expanded = isCategoryExpanded,
                        onExpandedChange = { isCategoryExpanded = it }
                    ) {
                        TextField(
                            value = selectedCategory?.name ?: "",
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isCategoryExpanded) },
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
                            expanded = isCategoryExpanded,
                            onDismissRequest = { isCategoryExpanded = false }
                        ) {
                            categories.forEach { cat ->
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text(cat.name) },
                                    onClick = {
                                        selectedCategory = cat
                                        isCategoryExpanded = false
                                    }
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    Text("Asignar técnico (opcional)", style = MaterialTheme.typography.bodySmall)
                    ExposedDropdownMenuBox(
                        expanded = isTechnicianExpanded,
                        onExpandedChange = { isTechnicianExpanded = it }
                    ) {
                        TextField(
                            value = selectedTechnician?.let { listOfNotNull(it.first_name, it.last_name).joinToString(" ").ifBlank { it.username ?: "" } } ?: "",
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
                            technicians.forEach { tech ->
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text(listOfNotNull(tech.first_name, tech.last_name).joinToString(" ").ifBlank { tech.username ?: "" }) },
                                    onClick = {
                                        selectedTechnician = tech
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

                    // Sección opcional de Hardware
                    Text("Detalles de hardware (opcional)", style = MaterialTheme.typography.bodySmall)
                    OutlinedTextField(
                        value = dispositivo,
                        onValueChange = { dispositivo = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp),
                        shape = RoundedCornerShape(8.dp),
                        placeholder = { Text("Dispositivo / Modelo") }
                    )
                    OutlinedTextField(
                        value = serie,
                        onValueChange = { serie = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 12.dp),
                        shape = RoundedCornerShape(8.dp),
                        placeholder = { Text("Número de serie") }
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
                                // Validaciones mínimas para evitar 500
                                if (nombre.length < 5) {
                                    Toast.makeText(context, "Título mínimo 5 caracteres", Toast.LENGTH_LONG).show()
                                    return@Button
                                }
                                if (descripcion.length < 10) {
                                    Toast.makeText(context, "Descripción mínima 10 caracteres", Toast.LENGTH_LONG).show()
                                    return@Button
                                }
                                val priorityId = selectedPriority?.id
                                val categoryId = selectedCategory?.id
                                if (priorityId == null || categoryId == null) {
                                    Toast.makeText(context, "Selecciona categoría y prioridad", Toast.LENGTH_LONG).show()
                                    return@Button
                                }

                                // Armar descripción final incluyendo hardware si aplica
                                val fullDescription = buildString {
                                    if (dispositivo.isNotBlank() || serie.isNotBlank()) {
                                        appendLine("Hardware:")
                                        if (dispositivo.isNotBlank()) appendLine("- Dispositivo: $dispositivo")
                                        if (serie.isNotBlank()) appendLine("- S/N: $serie")
                                        appendLine()
                                    }
                                    append(descripcion.ifBlank { "" })
                                }

                                val req = CreateTicketRequest(
                                    title = nombre.ifBlank { "Ticket sin título" },
                                    description = fullDescription,
                                    category_id = categoryId,
                                    priority_id = priorityId,
                                    client_company = compania.ifBlank { null },
                                    client_contact = nombre.ifBlank { null },
                                    location = ubicacion.ifBlank { null },
                                    priority_justification = null
                                )

                                coroutineScope.launch {
                                    try {
                                        val resp = RetrofitClient.instance.createTicket(req)
                                        if (resp.isSuccessful && (resp.body()?.success == true)) {
                                            val returnedLocation = resp.body()?.data?.location
                                            if ((ubicacion.ifBlank { null }) != returnedLocation) {
                                                Toast.makeText(context, "Aviso: ubicación guardada difiere: ${'$'}returnedLocation", Toast.LENGTH_LONG).show()
                                            }
                                            val createdId = resp.body()?.data?.id
                                            // Intentar asignación si se eligió técnico (nota: requiere rol admin)
                                            if (createdId != null && selectedTechnician != null) {
                                                try {
                                                    val assignResp = RetrofitClient.instance.assignTicket(
                                                        createdId,
                                                        AssignTicketRequest(technician_id = selectedTechnician!!.id)
                                                    )
                                                    if (!assignResp.isSuccessful) {
                                                        Toast.makeText(context, "Ticket creado, asignación falló (${assignResp.code()})", Toast.LENGTH_LONG).show()
                                                    }
                                                } catch (e: Exception) {
                                                    Toast.makeText(context, "Ticket creado, error al asignar: ${e.message}", Toast.LENGTH_LONG).show()
                                                }
                                            } else {
                                                Toast.makeText(context, "Ticket creado", Toast.LENGTH_SHORT).show()
                                            }
                                            navController.popBackStack()
                                        } else {
                                            Toast.makeText(context, "Error al crear: ${resp.code()} ${resp.message()}", Toast.LENGTH_LONG).show()
                                        }
                                    } catch (e: Exception) {
                                        Toast.makeText(context, "Error de red: ${e.message}", Toast.LENGTH_LONG).show()
                                    }
                                }
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
