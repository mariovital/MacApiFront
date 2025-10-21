package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FaqScreen(navController: NavController, role: String) {
    val title = when (role.lowercase()) {
        "tecnico" -> "FAQ Técnico"
        "mesa" -> "FAQ Mesa de Ayuda"
        else -> "Preguntas frecuentes"
    }

    val items = when (role.lowercase()) {
        "tecnico" -> tecnicoFaqItems()
        "mesa" -> mesaFaqItems()
        else -> emptyList()
    }

    var query by rememberSaveable { mutableStateOf("") }
    val filtered = if (query.isBlank()) items else items.filter { it.question.contains(query, true) || it.answer.contains(query, true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title, color = MaterialTheme.colorScheme.onPrimary) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Atrás", tint = MaterialTheme.colorScheme.onPrimary)
                    }
                },
                colors = androidx.compose.material3.TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier
                    .fillMaxWidth(),
                placeholder = { Text("Buscar en preguntas y respuestas") },
                singleLine = true
            )

            FaqSection(items = filtered)
        }
    }
}

private fun tecnicoFaqItems(): List<FaqItem> = listOf(
    FaqItem("¿Dónde veo mis tickets pendientes?", "En la pestaña 'Mis Tickets'. Puedes buscar por texto y usar filtros locales."),
    FaqItem("¿Cómo actualizo el estado?", "Abre el detalle del ticket y cambia a En progreso, Completado o Rechazado, según corresponda."),
    FaqItem("¿Puedo rechazar un ticket con motivo?", "Sí. En el detalle, selecciona Rechazar y escribe el motivo antes de confirmar."),
    FaqItem("¿Cómo agrego comentarios y adjuntos?", "En la pestaña Adjuntos/Comentarios, usa el campo de comentario y el cargador de archivos."),
    FaqItem("¿Hay límite de adjuntos o tamaño?", "Por lo general 10 MB por archivo (puede variar por configuración). Usa formatos comunes (jpg, png, pdf)."),
    FaqItem("¿Qué son los 'Tickets pasados'?", "Son tickets Completados o Rechazados. Puedes filtrarlos y buscar por texto."),
    FaqItem("¿Cómo reabro un ticket?", "Si la política lo permite, en el detalle verás la opción Reabrir. Esto lo mueve a Pendiente."),
    FaqItem("¿Y si no tengo red?", "Las peticiones reintentan conexión automáticamente. Si un envío falla, vuelve a intentar cuando tengas red."),
    FaqItem("¿Cómo navegar a la dirección del ticket?", "Si el ticket incluye ubicación, usa el botón de navegación del detalle para abrir tu app de mapas."),
    FaqItem("¿Cómo reporto un problema?", "Desde Configuración > Contacto/Soporte o reporta a tu supervisor."),
    FaqItem("¿Qué significan las prioridades?", "Alta requiere atención inmediata; Media y Baja según SLA. Verás un distintivo de color en cada ticket."),
    FaqItem("¿Puedo pausar o reanudar trabajo?", "Si tu flujo lo soporta, verás acciones de Pausar/Reanudar en el detalle.")
)

private fun mesaFaqItems(): List<FaqItem> = listOf(
    FaqItem("¿Cómo crear un ticket?", "Ve a Tickets y toca el botón +. Completa título, descripción, categoría y prioridad."),
    FaqItem("¿Cómo editar un ticket?", "Abre el ticket y usa Editar para actualizar la información mientras esté abierto."),
    FaqItem("¿Cómo asignar o reasignar a un técnico?", "En el detalle, elige Asignar y selecciona el técnico disponible o cambia el asignado."),
    FaqItem("¿Cómo cambiar prioridad o categoría?", "Abre el ticket y ajusta los campos desde Editar (si el estado lo permite)."),
    FaqItem("¿Cómo aplicar filtros y búsqueda?", "En las listas tienes búsqueda por texto y filtros por estado/prioridad. Para fechas, usa el filtro avanzado (si está disponible)."),
    FaqItem("¿Puedo reabrir, cancelar o eliminar?", "Según permisos: Reabrir regresa a Pendiente, Cancelar cierra sin resolver, Eliminar quita del listado (puede ser blando)."),
    FaqItem("¿Cuáles son los límites de adjuntos?", "Generalmente 10 MB por archivo y formatos comunes (jpg, png, pdf)."),
    FaqItem("¿Dónde veo el historial?", "En la pestaña 'Tickets pasados'. Puedes filtrar Completados y Rechazados."),
    FaqItem("¿Cómo gestiono comentarios?", "En el detalle, pestaña Adjuntos/Comentarios, puedes leer y publicar comentarios."),
    FaqItem("¿Notificaciones?", "Si están habilitadas, recibirás avisos por asignación, cambios de estado y comentarios."),
    FaqItem("¿Problemas de acceso?", "Usa recuperación de contraseña o contacta al administrador para restablecer tu cuenta."),
    FaqItem("¿Cómo contactar soporte?", "Desde Configuración > Contacto/Soporte o a través de los canales de tu organización.")
)
