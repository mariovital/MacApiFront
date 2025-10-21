package mx.tec.prototipo_01.ui.screens

import android.content.ContentResolver
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AttachFile
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.Alignment
import android.os.SystemClock
import androidx.compose.ui.platform.LocalContext
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.width
import androidx.navigation.NavController
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.api.TicketAttachment
import mx.tec.prototipo_01.models.api.CommentItem
import mx.tec.prototipo_01.models.api.CreateCommentRequest
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.FileOutputStream
import coil.compose.AsyncImage
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.graphics.Color

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TecnicoTicketAttachments(
    navController: NavController,
    id: String?,
    title: String?,
    company: String?,
    assignedTo: String?,
    status: String?,
    priority: String?
) {
    val scope = rememberCoroutineScope()
    var loading by remember { mutableStateOf(false) }
    var items by remember { mutableStateOf(listOf<TicketAttachment>()) }
    var comments by remember { mutableStateOf(listOf<CommentItem>()) }
    var commentsLoading by remember { mutableStateOf(false) }
    var newComment by remember { mutableStateOf("") }
    val ctx = LocalContext.current
    var previewImageUrl by remember { mutableStateOf<String?>(null) }

    // Mapeo ticket_number -> backend id no disponible aquí; pedimos lista general y filtramos por ticket_number
    // Para simplificar, exigen backendId; si no lo tenemos, mostramos instrucción.
    val ticketNumber = id

    // Intento obtener backendId consultando el detalle si tuviéramos endpoint por ticket_number; como no lo hay, avisamos.
    // Usaremos un parámetro obligatorio en navigation: backend id no está disponible, así que haremos una consulta previa en detalles si hiciera falta.

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Adjuntar evidencias", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    val lastBackClick = remember { mutableStateOf(0L) }
                    IconButton(onClick = {
                        val now = SystemClock.elapsedRealtime()
                        if (now - lastBackClick.value > 700) {
                            lastBackClick.value = now
                            navController.navigateUp()
                        }
                    }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver atrás")
                    }
                }
            )
        }
    ) { padding ->
    Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Text(text = title ?: "Ticket", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "${company ?: ""} • ${status ?: ""} • ${priority ?: ""}", style = MaterialTheme.typography.bodyMedium)

            Spacer(modifier = Modifier.height(16.dp))

            // Botones para seleccionar archivo o foto
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                val docPicker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
                    if (uri != null) {
                        scope.launch {
                            uploadFromUri(uri, ctx.contentResolver, ticketNumber, onUploaded = {
                                scope.launch { refreshList(ticketNumber, onLoaded = { items = it }) }
                            })
                        }
                    }
                }

                Button(onClick = { docPicker.launch("application/pdf") }) {
                    Icon(Icons.Filled.AttachFile, contentDescription = null)
                    Spacer(modifier = Modifier.height(0.dp))
                    Text("Subir PDF")
                }

                val imagePicker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
                    if (uri != null) {
                        scope.launch {
                            uploadFromUri(uri, ctx.contentResolver, ticketNumber, onUploaded = {
                                scope.launch { refreshList(ticketNumber, onLoaded = { items = it }) }
                            })
                        }
                    }
                }
                OutlinedButton(onClick = { imagePicker.launch("image/*") }) {
                    Text("Subir imagen")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Listado de adjuntos con miniaturas
            if (loading) {
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            }
            LazyColumn {
                items(items) { att ->
                    val isImage = att.is_image || att.file_type.startsWith("image/")
                    val fileUrl = absoluteUrl(att.s3_url)
                    ListItem(
                        leadingContent = {
                            if (isImage) {
                                AsyncImage(
                                    model = fileUrl,
                                    contentDescription = "miniatura",
                                    modifier = Modifier.size(48.dp),
                                    contentScale = ContentScale.Crop
                                )
                            } else if (att.file_type == "application/pdf" || att.original_name.endsWith(".pdf", true)) {
                                Icon(Icons.Default.PictureAsPdf, contentDescription = null, tint = Color(0xFFD32F2F))
                            } else {
                                Icon(Icons.Default.AttachFile, contentDescription = null)
                            }
                        },
                        headlineContent = { Text(att.original_name) },
                        supportingContent = { Text("${att.file_type} • ${(att.file_size / 1024)} KB") },
                        modifier = Modifier.clickable {
                            if (isImage) {
                                previewImageUrl = fileUrl
                            } else {
                                // Abrir con visor externo (PDF o genérico)
                                openExternal(ctx, fileUrl, att.file_type)
                            }
                        }
                    )
                    Divider()
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Divider()
            Spacer(modifier = Modifier.height(8.dp))
            Text("Comentarios", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(8.dp))
            if (commentsLoading) {
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            }
            LazyColumn {
                items(comments) { c ->
                    val author = listOfNotNull(c.author?.first_name, c.author?.last_name).joinToString(" ").ifBlank { c.author?.username ?: "" }
                    val meta = buildString {
                        if (!author.isNullOrBlank()) append(author)
                        val ts = (c.created_at).replace("T"," ").replace(".000Z","")
                        if (isNotEmpty()) append(" · ")
                        append(ts)
                        if (c.is_internal) append(" · interno")
                    }
                    ListItem(
                        headlineContent = { Text(c.comment) },
                        supportingContent = { Text(meta) }
                    )
                    Divider()
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = newComment,
                    onValueChange = { newComment = it },
                    modifier = Modifier.weight(1f),
                    label = { Text("Agregar comentario") },
                    singleLine = false,
                    maxLines = 4
                )
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = {
                        val text = newComment.trim()
                        if (text.isNotEmpty()) {
                            scope.launch {
                                postComment(ticketNumber, text) {
                                    newComment = ""
                                    scope.launch { refreshComments(ticketNumber) { comments = it } }
                                }
                            }
                        }
                    },
                    enabled = newComment.trim().isNotEmpty()
                ) { Text("Enviar") }
            }

            // Diálogo de previsualización de imagen
            val currentPreview = previewImageUrl
            if (currentPreview != null) {
                Dialog(onDismissRequest = { previewImageUrl = null }, properties = DialogProperties(usePlatformDefaultWidth = false)) {
                    Surface(color = Color.Black.copy(alpha = 0.8f)) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)) {
                            AsyncImage(
                                model = currentPreview,
                                contentDescription = "vista previa",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(400.dp),
                                contentScale = ContentScale.Fit
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            OutlinedButton(onClick = { previewImageUrl = null }) { Text("Cerrar") }
                        }
                    }
                }
            }
        }
    }

    // Cargar lista inicial
    LaunchedEffect(ticketNumber) {
        loading = true
        try {
            refreshList(ticketNumber, onLoaded = { items = it })
            commentsLoading = true
            try { refreshComments(ticketNumber) { comments = it } } finally { commentsLoading = false }
        } finally {
            loading = false
        }
    }
}

private suspend fun uploadFromUri(
    uri: Uri,
    cr: ContentResolver,
    ticketNumber: String?,
    onUploaded: () -> Unit
) {
    if (ticketNumber.isNullOrBlank()) return
    // No tenemos backendId aquí; intentamos resolverlo obteniendo tickets y buscando por ticket_number
    withContext(Dispatchers.IO) {
        val listRes = RetrofitClient.instance.getTickets(limit = 200)
        val backendId = if (listRes.isSuccessful) {
            val items = listRes.body()?.data?.items.orEmpty()
            items.firstOrNull { it.ticket_number == ticketNumber }?.id
        } else null
        if (backendId == null) return@withContext

        val file = createTempFileFromUri(cr, uri) ?: return@withContext
        val mime = cr.getType(uri) ?: guessMimeFromName(file.name)
        val reqBody: RequestBody = file.asRequestBody(mime.toMediaTypeOrNull())
        val part = MultipartBody.Part.createFormData("file", file.name, reqBody)
        val res = RetrofitClient.instance.uploadAttachment(backendId, part)
        if (res.isSuccessful) {
            withContext(Dispatchers.Main) { onUploaded() }
        }
        // Cleanup temp file
        try { file.delete() } catch (_: Exception) {}
    }
}

private suspend fun refreshList(ticketNumber: String?, onLoaded: (List<TicketAttachment>) -> Unit) {
    if (ticketNumber.isNullOrBlank()) return
    withContext(Dispatchers.IO) {
        val listRes = RetrofitClient.instance.getTickets(limit = 200)
        val backendId = if (listRes.isSuccessful) {
            val items = listRes.body()?.data?.items.orEmpty()
            items.firstOrNull { it.ticket_number == ticketNumber }?.id
        } else null
        if (backendId == null) return@withContext
        val res = RetrofitClient.instance.listAttachments(backendId)
        if (res.isSuccessful) {
            withContext(Dispatchers.Main) { onLoaded(res.body()?.data ?: emptyList()) }
        }
    }
}

private suspend fun refreshComments(ticketNumber: String?, onLoaded: (List<CommentItem>) -> Unit) {
    if (ticketNumber.isNullOrBlank()) return
    withContext(Dispatchers.IO) {
        val listRes = RetrofitClient.instance.getTickets(limit = 200)
        val backendId = if (listRes.isSuccessful) {
            val items = listRes.body()?.data?.items.orEmpty()
            items.firstOrNull { it.ticket_number == ticketNumber }?.id
        } else null
        if (backendId == null) return@withContext
        val res = RetrofitClient.instance.getTicketComments(backendId)
        if (res.isSuccessful) {
            withContext(Dispatchers.Main) { onLoaded(res.body()?.data ?: emptyList()) }
        }
    }
}

private suspend fun postComment(ticketNumber: String?, text: String, onPosted: () -> Unit) {
    if (ticketNumber.isNullOrBlank()) return
    withContext(Dispatchers.IO) {
        val listRes = RetrofitClient.instance.getTickets(limit = 200)
        val backendId = if (listRes.isSuccessful) {
            val items = listRes.body()?.data?.items.orEmpty()
            items.firstOrNull { it.ticket_number == ticketNumber }?.id
        } else null
        if (backendId == null) return@withContext
        val res = RetrofitClient.instance.addTicketComment(backendId, CreateCommentRequest(comment = text))
        if (res.isSuccessful) {
            withContext(Dispatchers.Main) { onPosted() }
        }
    }
}

private fun absoluteUrl(pathOrUrl: String): String {
    return if (pathOrUrl.startsWith("http")) pathOrUrl else RetrofitClientBase() + pathOrUrl.removePrefix("/")
}

private fun RetrofitClientBase(): String {
    // BASE_URL en RetrofitClient termina con /api/
    // Los archivos se exponen en /uploads, así que base debe ser http://10.0.2.2:3001/
    // Nota: Esta URL debe coincidir con el entorno configurado en ApiConfig
    val apiUrl = mx.tec.prototipo_01.config.ApiConfig.BASE_URL
    // Remover /api/ del final para llegar a la raíz del servidor
    return apiUrl.replace("/api/", "/")
}

private fun openExternal(ctx: android.content.Context, url: String, mime: String?) {
    try {
        val intent = android.content.Intent(android.content.Intent.ACTION_VIEW).apply {
            data = android.net.Uri.parse(url)
            if (!mime.isNullOrBlank()) setDataAndType(android.net.Uri.parse(url), mime)
            addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        ctx.startActivity(intent)
    } catch (_: Exception) { }
}

private fun createTempFileFromUri(cr: ContentResolver, uri: Uri): File? {
    return try {
        val input = cr.openInputStream(uri) ?: return null
        val fileName = getFileName(cr, uri) ?: "upload.bin"
        val outputFile = File.createTempFile("upload_", "_${fileName}")
        FileOutputStream(outputFile).use { out ->
            input.copyTo(out)
        }
        outputFile
    } catch (_: Exception) {
        null
    }
}

private fun getFileName(cr: ContentResolver, uri: Uri): String? {
    return try {
        var name: String? = null
        val cursor = cr.query(uri, null, null, null, null)
        cursor?.use {
            val nameIdx = it.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME)
            if (it.moveToFirst() && nameIdx >= 0) name = it.getString(nameIdx)
        }
        name
    } catch (_: Exception) { null }
}

private fun guessMimeFromName(name: String): String {
    val lower = name.lowercase()
    return when {
        lower.endsWith(".pdf") -> "application/pdf"
        lower.endsWith(".jpg") || lower.endsWith(".jpeg") -> "image/jpeg"
        lower.endsWith(".png") -> "image/png"
        else -> "application/octet-stream"
    }
}
