# 📄 Sistema de Generación de PDF para Firma Física

## 📋 **Resumen**

Sistema completo de generación de PDFs para firma física de tickets finalizados. El PDF incluye toda la información del ticket y campos vacíos para firma del técnico y cliente.

---

## ✅ **Estado de Implementación**

### **Backend (Node.js/Express)** ✅ COMPLETO
- ✅ Servicio de generación de PDF (`pdfService.js`)
- ✅ Controlador con endpoints (`pdfController.js`)
- ✅ Rutas configuradas (`/api/pdf/ticket/:id`)
- ✅ Modelo actualizado con campos de tracking
- ✅ Base de datos migrada (campos agregados)

### **Frontend Web (React)** ✅ COMPLETO
- ✅ Servicio de API (`pdfService.js`)
- ✅ Componente botón (`GeneratePDFButton.jsx`)
- ✅ Integrado en `TicketDetail.jsx`

### **Android (Kotlin)** 🔄 PENDIENTE
- ⏳ Endpoint en ApiService
- ⏳ Función de descarga de PDF
- ⏳ Botón en UI de detalle de ticket
- ⏳ Permisos de almacenamiento

---

## 🌐 **Endpoints de la API**

### **1. Generar y Descargar PDF**
```http
GET /api/pdf/ticket/:id
Authorization: Bearer {token}
```

**Respuesta:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="Ticket_{ticket_number}_{timestamp}.pdf"`

**Errores:**
- `404` - Ticket no encontrado
- `403` - Sin permisos para generar PDF
- `500` - Error generando PDF

### **2. Obtener Información de PDFs**
```http
GET /api/pdf/ticket/:id/info
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "ticket_id": 123,
    "ticket_number": "ID-2025-01-001",
    "pdf_generated": true,
    "last_generated_at": "2025-01-20T15:30:00.000Z",
    "generation_count": 3
  }
}
```

---

## 📱 **Implementación en Android**

### **PASO 1: Agregar Permisos en AndroidManifest.xml**

```xml
<!-- Android/Mac_Android/app/src/main/AndroidManifest.xml -->

<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permisos existentes... -->
    
    <!-- Permisos para descarga de archivos -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    
    <application>
        <!-- ... -->
    </application>
</manifest>
```

### **PASO 2: Agregar Endpoint en ApiService.kt**

```kotlin
// Android/Mac_Android/app/src/main/java/mx/tec/prototipo_01/api/ApiService.kt

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Streaming

interface ApiService {
    // ... endpoints existentes ...

    /**
     * Generar y descargar PDF de un ticket
     * @param ticketId ID del ticket
     * @return ResponseBody con el archivo PDF
     */
    @Streaming
    @GET("pdf/ticket/{id}")
    suspend fun generateTicketPDF(
        @Path("id") ticketId: Int
    ): Response<ResponseBody>

    /**
     * Obtener información de PDFs generados
     * @param ticketId ID del ticket
     * @return Información del PDF
     */
    @GET("pdf/ticket/{id}/info")
    suspend fun getTicketPDFInfo(
        @Path("id") ticketId: Int
    ): Response<PDFInfoResponse>
}

// Data class para la respuesta
data class PDFInfoResponse(
    val success: Boolean,
    val data: PDFInfo
)

data class PDFInfo(
    val ticket_id: Int,
    val ticket_number: String,
    val pdf_generated: Boolean,
    val last_generated_at: String?,
    val generation_count: Int
)
```

### **PASO 3: Crear Función de Descarga en ViewModel**

```kotlin
// Android/Mac_Android/app/src/main/java/mx/tec/prototipo_01/viewmodels/TecnicoSharedViewModel.kt

import android.content.ContentValues
import android.content.Context
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

class TecnicoSharedViewModel(application: Application) : AndroidViewModel(application) {
    // ... código existente ...

    /**
     * Generar y descargar PDF de un ticket
     */
    suspend fun downloadTicketPDF(ticketId: Int): Result<String> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.generateTicketPDF(ticketId)
            
            if (!response.isSuccessful) {
                return@withContext Result.failure(
                    Exception("Error: ${response.code()} - ${response.message()}")
                )
            }

            val body = response.body() ?: return@withContext Result.failure(
                Exception("Respuesta vacía del servidor")
            )

            // Obtener nombre del archivo del header
            val contentDisposition = response.headers()["Content-Disposition"]
            val fileName = extractFileName(contentDisposition) 
                ?: "Ticket_${ticketId}_${System.currentTimeMillis()}.pdf"

            // Guardar el archivo
            val savedPath = saveFile(body.byteStream(), fileName)
            
            Result.success(savedPath)
        } catch (e: Exception) {
            Log.e("TecnicoVM", "Error descargando PDF", e)
            Result.failure(e)
        }
    }

    /**
     * Extraer nombre del archivo del header Content-Disposition
     */
    private fun extractFileName(contentDisposition: String?): String? {
        if (contentDisposition == null) return null
        
        val pattern = "filename=\"([^\"]+)\"".toRegex()
        val match = pattern.find(contentDisposition)
        return match?.groupValues?.get(1)
    }

    /**
     * Guardar archivo en el almacenamiento
     */
    private fun saveFile(inputStream: InputStream, fileName: String): String {
        val context = getApplication<Application>().applicationContext
        
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Android 10+ - Usar MediaStore
            saveFileWithMediaStore(context, inputStream, fileName)
        } else {
            // Android 9 y anteriores - Usar File
            saveFileWithFile(inputStream, fileName)
        }
    }

    /**
     * Guardar archivo usando MediaStore (Android 10+)
     */
    @RequiresApi(Build.VERSION_CODES.Q)
    private fun saveFileWithMediaStore(
        context: Context, 
        inputStream: InputStream, 
        fileName: String
    ): String {
        val resolver = context.contentResolver
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf")
            put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
        }

        val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
            ?: throw Exception("Error creando archivo")

        resolver.openOutputStream(uri)?.use { outputStream ->
            inputStream.copyTo(outputStream)
        } ?: throw Exception("Error escribiendo archivo")

        return "Downloads/$fileName"
    }

    /**
     * Guardar archivo usando File (Android 9 y anteriores)
     */
    private fun saveFileWithFile(inputStream: InputStream, fileName: String): String {
        val downloadsDir = Environment.getExternalStoragePublicDirectory(
            Environment.DIRECTORY_DOWNLOADS
        )
        val file = File(downloadsDir, fileName)

        FileOutputStream(file).use { outputStream ->
            inputStream.copyTo(outputStream)
        }

        return file.absolutePath
    }
}
```

### **PASO 4: Agregar Botón en la UI**

#### **Opción A: En la Pantalla de Detalle del Ticket**

```kotlin
// Android/Mac_Android/app/src/main/java/mx/tec/prototipo_01/ui/tecnico/TicketDetailScreen.kt

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.Icon
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember

@Composable
fun TicketDetailScreen(
    ticketId: Int,
    viewModel: TecnicoSharedViewModel,
    onBack: () -> Unit
) {
    var isDownloadingPDF by remember { mutableStateOf(false) }
    var pdfDownloadError by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    // ... código existente del detalle del ticket ...

    // Agregar botón para generar PDF
    // Solo mostrar si el ticket está en estado Resuelto (5) o Cerrado (6)
    if (ticket.status_id == 5 || ticket.status_id == 6) {
        Button(
            onClick = {
                coroutineScope.launch {
                    isDownloadingPDF = true
                    pdfDownloadError = null
                    
                    val result = viewModel.downloadTicketPDF(ticketId)
                    
                    result.onSuccess { path ->
                        Toast.makeText(
                            context,
                            "PDF descargado: $path",
                            Toast.LENGTH_LONG
                        ).show()
                    }.onFailure { error ->
                        pdfDownloadError = error.message ?: "Error descargando PDF"
                        Toast.makeText(
                            context,
                            "Error: ${pdfDownloadError}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    
                    isDownloadingPDF = false
                }
            },
            enabled = !isDownloadingPDF,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Icon(
                imageVector = Icons.Default.PictureAsPdf,
                contentDescription = "Generar PDF"
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (isDownloadingPDF) "Generando PDF..." else "Generar PDF para Firma"
            )
        }
    }
}
```

### **PASO 5: Solicitar Permisos en Runtime (Android 6+)**

```kotlin
// Android/Mac_Android/app/src/main/java/mx/tec/prototipo_01/ui/tecnico/TicketDetailScreen.kt

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import android.Manifest
import android.os.Build

@Composable
fun TicketDetailScreen(/* ... */) {
    // Launcher para solicitar permisos
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            // Permiso concedido, proceder con descarga
            downloadPDF()
        } else {
            Toast.makeText(
                context,
                "Se requiere permiso para descargar archivos",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    fun checkPermissionAndDownload() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            // Android 9 y anteriores requieren WRITE_EXTERNAL_STORAGE
            if (ContextCompat.checkSelfPermission(
                    context,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                downloadPDF()
            } else {
                permissionLauncher.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            }
        } else {
            // Android 10+ no requiere permisos para Downloads
            downloadPDF()
        }
    }

    fun downloadPDF() {
        coroutineScope.launch {
            // Lógica de descarga aquí...
        }
    }

    // Modificar el botón para usar checkPermissionAndDownload()
    Button(onClick = { checkPermissionAndDownload() }) {
        // ...
    }
}
```

---

## 🎨 **Contenido del PDF Generado**

El PDF incluye las siguientes secciones:

### **1. Header**
- Logo de MAC Computadoras
- Título: "ORDEN DE SERVICIO"
- Número de ticket

### **2. Información General**
- Fecha de apertura
- Fecha de cierre
- Tiempo de resolución
- Categoría
- Prioridad

### **3. Datos del Cliente**
- Empresa
- Contacto
- Ubicación

### **4. Técnico Responsable**
- Nombre completo
- Correo electrónico

### **5. Descripción del Problema**
- Texto completo de la descripción original

### **6. Solución Aplicada**
- Solución detallada (campo `resolution_notes`)

### **7. Archivos Adjuntos**
- Lista de archivos con fecha y usuario que lo subió

### **8. Historial de Cambios**
- Todos los cambios de estado cronológicamente

### **9. Sección de Firmas**
- **Firma del Técnico**: Campo vacío con línea
- **Firma del Cliente**: Campo vacío con línea + nombre + fecha

### **10. Footer**
- "MAC Computadoras © 2025"
- Fecha y hora de generación

---

## 🔒 **Permisos y Seguridad**

### **Reglas de Acceso**
- ✅ **Admin**: Puede generar PDF de cualquier ticket
- ✅ **Técnico**: Solo de tickets asignados a él
- ✅ **Mesa de Trabajo**: Solo de tickets creados por él

### **Estados Válidos para Generar PDF**
- ✅ Estado 5: **Resuelto**
- ✅ Estado 6: **Cerrado**
- ❌ Otros estados: Botón no visible

---

## 🧪 **Testing**

### **Prueba desde Dashboard Web:**

1. Login como técnico o admin
2. Ir a detalle de un ticket Resuelto o Cerrado
3. Click en botón "Generar PDF"
4. Verificar descarga automática
5. Abrir PDF y verificar contenido completo

### **Prueba desde Postman:**

```http
GET http://localhost:3001/api/pdf/ticket/123
Authorization: Bearer {tu_token_aqui}
```

### **Verificar Tracking:**

```sql
SELECT id, ticket_number, pdf_generated_at, pdf_generated_count 
FROM tickets 
WHERE id = 123;
```

---

## 📊 **Base de Datos**

### **Campos Agregados a `tickets`:**

```sql
ALTER TABLE tickets 
ADD COLUMN pdf_generated_at DATETIME DEFAULT NULL,
ADD COLUMN pdf_generated_count INT DEFAULT 0;
```

### **Consultar Estadísticas:**

```sql
-- Tickets con PDFs generados
SELECT COUNT(*) as total_with_pdf
FROM tickets
WHERE pdf_generated_at IS NOT NULL;

-- Ticket con más regeneraciones
SELECT ticket_number, pdf_generated_count
FROM tickets
ORDER BY pdf_generated_count DESC
LIMIT 10;
```

---

## 🐛 **Troubleshooting**

### **Error: "Cannot read properties of undefined (reading 'name')"**
**Causa:** Ticket no tiene todas las relaciones cargadas
**Solución:** Verificar que el backend incluye todos los `include` en el query

### **Error: "ENOENT: no such file or directory"**
**Causa:** pdfkit no puede encontrar fuentes
**Solución:** Ya incluido en pdfService.js - usa fuentes embebidas

### **Error: PDF descarga pero está corrupto**
**Causa:** Response type incorrecto en Axios
**Solución:** Verificar `responseType: 'blob'` en frontend

### **Android: "Permission Denied"**
**Causa:** Sin permisos de almacenamiento
**Solución:** Implementar solicitud de permisos en runtime

---

## 📝 **Próximas Mejoras (Opcional)**

1. **Firma Digital**: Agregar canvas para firma en lugar de imprimir
2. **Email Automático**: Enviar PDF por email al cliente
3. **Almacenamiento S3**: Guardar PDFs generados en S3
4. **Plantillas Personalizadas**: Diferentes diseños según categoría
5. **QR Code**: Agregar QR con link al ticket

---

## ✅ **Checklist de Implementación**

### **Backend** ✅
- [x] Instalar pdfkit
- [x] Crear pdfService.js
- [x] Crear pdfController.js
- [x] Crear routes/pdf.js
- [x] Registrar rutas en app.js
- [x] Actualizar modelo Ticket
- [x] Ejecutar ALTER TABLE

### **Frontend Web** ✅
- [x] Crear services/pdfService.js
- [x] Crear components/tickets/GeneratePDFButton.jsx
- [x] Integrar en TicketDetail.jsx

### **Android** ⏳
- [ ] Agregar permisos en AndroidManifest.xml
- [ ] Agregar endpoint en ApiService.kt
- [ ] Crear función de descarga en ViewModel
- [ ] Agregar botón en UI
- [ ] Implementar solicitud de permisos
- [ ] Testing en dispositivo real

---

**Última actualización:** 20 de enero de 2025
**Autor:** Asistente AI + Vital
**Versión:** 1.0.0

