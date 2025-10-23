package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.AttachFile
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import coil.request.ImageRequest
import coil.size.Precision
import coil.size.Scale
import androidx.compose.ui.platform.LocalDensity
import android.graphics.Bitmap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.api.CommentItem
import mx.tec.prototipo_01.models.api.CreateCommentRequest
import mx.tec.prototipo_01.models.api.TicketAttachment
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MesaTicketAttachments(
    navController: NavController,
    id: String?,
    title: String?,
    company: String?,
    assignedTo: String?,
    status: String?,
    priority: String?
) {
    val scope = rememberCoroutineScope()
    val ctx = LocalContext.current

    val ticketNumber = id?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: return
    var loading by remember { mutableStateOf(false) }
    var items by remember { mutableStateOf(listOf<TicketAttachment>()) }
    var comments by remember { mutableStateOf(listOf<CommentItem>()) }
    var commentsLoading by remember { mutableStateOf(false) }
    var newComment by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Evidencias", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
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
            Text(text = title?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) } ?: "Ticket", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = listOfNotNull(
                    company?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) },
                    status?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) },
                    priority?.let { URLDecoder.decode(it, StandardCharsets.UTF_8.toString()) }
                ).joinToString(" · "),
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (loading) LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            LazyColumn {
                items(items) { att ->
                    val isImage = att.is_image || att.file_type.startsWith("image/")
                    val fileUrl = absoluteUrl(att.s3_url)
                    ListItem(
                        leadingContent = {
                            if (isImage) {
                                val density = LocalDensity.current
                                val ctxLocal = LocalContext.current
                                val thumbPx = with(density) { 48.dp.roundToPx() }
                                val thumbReq = remember(fileUrl) {
                                    ImageRequest.Builder(ctxLocal)
                                        .data(fileUrl)
                                        .size(thumbPx)
                                        .scale(Scale.FILL)
                                        .precision(Precision.INEXACT)
                                        .bitmapConfig(Bitmap.Config.RGB_565)
                                        .crossfade(false)
                                        .build()
                                }
                                AsyncImage(
                                    model = thumbReq,
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
                        supportingContent = { Text("${att.file_type} · ${(att.file_size / 1024)} KB") },
                        modifier = Modifier.clickable {
                            // Solo lectura: abrir en visor externo
                            openExternal(ctx, fileUrl, att.file_type)
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
            if (commentsLoading) LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
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
                    ListItem(headlineContent = { Text(c.comment) }, supportingContent = { Text(meta) })
                    Divider()
                }
            }

            Spacer(modifier = androidx.compose.ui.Modifier.height(12.dp))
            androidx.compose.foundation.layout.Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                androidx.compose.material3.OutlinedTextField(
                    value = newComment,
                    onValueChange = { newComment = it },
                    modifier = androidx.compose.ui.Modifier.weight(1f),
                    label = { androidx.compose.material3.Text("Agregar comentario") },
                    singleLine = false,
                    maxLines = 4
                )
                Spacer(modifier = androidx.compose.ui.Modifier.width(8.dp))
                androidx.compose.material3.Button(
                    onClick = {
                        val text = newComment.trim()
                        if (text.isNotEmpty()) {
                            scope.launch {
                                // Resolver backendId por ticket_number, luego POST comentario
                                val backendId = withContext(Dispatchers.IO) {
                                    val listRes = RetrofitClient.instance.getTickets(limit = 200)
                                    if (listRes.isSuccessful) {
                                        listRes.body()?.data?.items.orEmpty().firstOrNull { it.ticket_number == ticketNumber }?.id
                                    } else null
                                }
                                if (backendId != null) {
                                    val posted = withContext(Dispatchers.IO) {
                                        val res = RetrofitClient.instance.addTicketComment(backendId, CreateCommentRequest(comment = text))
                                        res.isSuccessful
                                    }
                                    if (posted) {
                                        newComment = ""
                                        commentsLoading = true
                                        try {
                                            withContext(Dispatchers.IO) {
                                                val r = RetrofitClient.instance.getTicketComments(backendId)
                                                if (r.isSuccessful) comments = r.body()?.data ?: emptyList()
                                            }
                                        } finally { commentsLoading = false }
                                    }
                                }
                            }
                        }
                    },
                    enabled = newComment.trim().isNotEmpty()
                ) { androidx.compose.material3.Text("Enviar") }
            }
        }
    }

    LaunchedEffect(ticketNumber) {
        loading = true
        try {
            val backendId = withContext(Dispatchers.IO) {
                val listRes = RetrofitClient.instance.getTickets(limit = 200)
                if (listRes.isSuccessful) {
                    listRes.body()?.data?.items.orEmpty().firstOrNull { it.ticket_number == ticketNumber }?.id
                } else null
            }
            if (backendId != null) {
                withContext(Dispatchers.IO) {
                    RetrofitClient.instance.listAttachments(backendId).let { res ->
                        if (res.isSuccessful) items = res.body()?.data ?: emptyList()
                    }
                    commentsLoading = true
                    try {
                        RetrofitClient.instance.getTicketComments(backendId).let { res ->
                            if (res.isSuccessful) comments = res.body()?.data ?: emptyList()
                        }
                    } finally { commentsLoading = false }
                }
            }
        } finally { loading = false }
    }
}

private fun absoluteUrl(pathOrUrl: String): String {
    return if (pathOrUrl.startsWith("http")) pathOrUrl else RetrofitClientBase() + pathOrUrl.removePrefix("/")
}

private fun RetrofitClientBase(): String {
    val apiUrl = mx.tec.prototipo_01.config.ApiConfig.BASE_URL
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

private fun String.encodeUrl(): String = URLEncoder.encode(this, StandardCharsets.UTF_8.toString())
