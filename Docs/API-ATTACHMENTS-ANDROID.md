# 📎 API de Archivos Adjuntos - Documentación para Android

## 🎯 **Endpoints Críticos para Archivos**

Este documento detalla **TODOS** los endpoints necesarios para manejar archivos adjuntos (PDFs, imágenes, videos, documentos) en la aplicación Android de MAC Tickets.

---

## 📋 **Tabla de Contenidos**

1. [Subir un Archivo](#1-subir-un-archivo)
2. [Subir Múltiples Archivos](#2-subir-múltiples-archivos)
3. [Listar Archivos de un Ticket](#3-listar-archivos-de-un-ticket)
4. [Obtener Info de un Archivo](#4-obtener-info-de-un-archivo)
5. [Descargar un Archivo](#5-descargar-un-archivo)
6. [Eliminar un Archivo](#6-eliminar-un-archivo)
7. [Tipos de Archivo Permitidos](#tipos-de-archivo-permitidos)
8. [Códigos de Error](#códigos-de-error)
9. [Ejemplos de Implementación](#ejemplos-de-implementación-android)

---

## 🔐 **Autenticación**

**TODOS** los endpoints requieren autenticación JWT.

```
Header: Authorization: Bearer {JWT_TOKEN}
```

---

## 1️⃣ **Subir un Archivo**

### **Endpoint**
```
POST /api/tickets/{ticketId}/attachments
```

### **Descripción**
Sube un **único archivo** (imagen, PDF, documento, video) a un ticket específico.

### **Headers**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data
```

### **Body (multipart/form-data)**
```
file: [ARCHIVO]           (requerido) - El archivo a subir
description: string       (opcional) - Descripción del archivo
```

### **Ejemplo de Request (Android/Kotlin)**
```kotlin
val file = File("/path/to/image.jpg")
val requestFile = file.asRequestBody("image/jpeg".toMediaType())
val filePart = MultipartBody.Part.createFormData("file", file.name, requestFile)
val description = "Foto del problema con la impresora".toRequestBody("text/plain".toMediaType())

val call = apiService.uploadAttachment(ticketId, filePart, description)
```

### **Response Success (201 Created)**
```json
{
  "success": true,
  "message": "Archivo subido exitosamente",
  "data": {
    "id": 15,
    "ticket_id": 42,
    "uploaded_by": 5,
    "file_name": "foto_impresora.jpg",
    "file_path": "/uploads/a3f2c8d9-1234-4567-89ab-cdef12345678.jpg",
    "file_size": 2458624,
    "file_type": "image/jpeg",
    "description": "Foto del problema con la impresora",
    "created_at": "2025-10-16T15:30:45.000Z",
    "uploader": {
      "id": 5,
      "first_name": "Juan",
      "last_name": "Pérez",
      "username": "juan.perez"
    }
  }
}
```

### **Response Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "No se proporcionó ningún archivo"
}
```

### **Response Error (403 Forbidden)**
```json
{
  "success": false,
  "message": "No tienes permisos para adjuntar archivos a este ticket"
}
```

---

## 2️⃣ **Subir Múltiples Archivos**

### **Endpoint**
```
POST /api/tickets/{ticketId}/attachments/multiple
```

### **Descripción**
Sube **hasta 5 archivos** simultáneamente a un ticket.

### **Headers**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data
```

### **Body (multipart/form-data)**
```
files: [ARRAY DE ARCHIVOS]  (requerido) - Hasta 5 archivos
description: string          (opcional) - Descripción general
```

### **Límites**
- Máximo: **5 archivos por request**
- Tamaño máximo por archivo: **10MB**
- Tamaño total recomendado: **< 50MB**

### **Ejemplo de Request (Android/Kotlin)**
```kotlin
val files = listOf(
    File("/path/to/foto1.jpg"),
    File("/path/to/foto2.jpg"),
    File("/path/to/reporte.pdf")
)

val fileParts = files.map { file ->
    val requestFile = file.asRequestBody("*/*".toMediaType())
    MultipartBody.Part.createFormData("files", file.name, requestFile)
}

val call = apiService.uploadMultipleAttachments(ticketId, fileParts)
```

### **Response Success (201 Created)**
```json
{
  "success": true,
  "message": "3 archivo(s) subido(s) exitosamente",
  "data": [
    {
      "id": 16,
      "ticket_id": 42,
      "file_name": "foto1.jpg",
      "file_size": 1245678,
      "file_type": "image/jpeg",
      "created_at": "2025-10-16T15:35:12.000Z"
    },
    {
      "id": 17,
      "ticket_id": 42,
      "file_name": "foto2.jpg",
      "file_size": 1358902,
      "file_type": "image/jpeg",
      "created_at": "2025-10-16T15:35:12.000Z"
    },
    {
      "id": 18,
      "ticket_id": 42,
      "file_name": "reporte.pdf",
      "file_size": 456123,
      "file_type": "application/pdf",
      "created_at": "2025-10-16T15:35:12.000Z"
    }
  ]
}
```

---

## 3️⃣ **Listar Archivos de un Ticket**

### **Endpoint**
```
GET /api/tickets/{ticketId}/attachments
```

### **Descripción**
Obtiene **todos** los archivos adjuntos de un ticket.

### **Headers**
```
Authorization: Bearer {JWT_TOKEN}
```

### **Query Parameters**
Ninguno.

### **Response Success (200 OK)**
```json
{
  "success": true,
  "message": "Archivos obtenidos exitosamente",
  "data": {
    "ticket_id": 42,
    "count": 3,
    "attachments": [
      {
        "id": 18,
        "ticket_id": 42,
        "file_name": "reporte.pdf",
        "file_path": "/uploads/uuid-123.pdf",
        "file_size": 456123,
        "file_type": "application/pdf",
        "description": null,
        "created_at": "2025-10-16T15:35:12.000Z",
        "uploader": {
          "id": 5,
          "first_name": "Juan",
          "last_name": "Pérez"
        }
      },
      {
        "id": 17,
        "ticket_id": 42,
        "file_name": "foto2.jpg",
        "file_path": "/uploads/uuid-456.jpg",
        "file_size": 1358902,
        "file_type": "image/jpeg",
        "description": "Parte trasera del equipo",
        "created_at": "2025-10-16T15:35:10.000Z",
        "uploader": {
          "id": 5,
          "first_name": "Juan",
          "last_name": "Pérez"
        }
      }
    ]
  }
}
```

---

## 4️⃣ **Obtener Info de un Archivo**

### **Endpoint**
```
GET /api/attachments/{attachmentId}
```

### **Descripción**
Obtiene información detallada de un archivo específico.

### **Response Success (200 OK)**
```json
{
  "success": true,
  "message": "Archivo obtenido exitosamente",
  "data": {
    "id": 18,
    "ticket_id": 42,
    "file_name": "reporte.pdf",
    "file_path": "/uploads/uuid-123.pdf",
    "file_size": 456123,
    "file_type": "application/pdf",
    "description": "Reporte técnico del problema",
    "created_at": "2025-10-16T15:35:12.000Z",
    "uploader": {
      "id": 5,
      "first_name": "Juan",
      "last_name": "Pérez",
      "username": "juan.perez"
    },
    "ticket": {
      "id": 42,
      "ticket_number": "ID-2025-042",
      "title": "Problema con impresora HP LaserJet"
    }
  }
}
```

---

## 5️⃣ **Descargar un Archivo**

### **Endpoint**
```
GET /api/attachments/{attachmentId}/download
```

### **Descripción**
Genera una URL de descarga para el archivo.

### **Response Success (200 OK)**
```json
{
  "success": true,
  "message": "URL de descarga generada",
  "data": {
    "file_name": "reporte.pdf",
    "file_url": "/uploads/uuid-123.pdf",
    "file_size": 456123,
    "file_type": "application/pdf",
    "download_url": "http://api.mactickets.com/uploads/uuid-123.pdf"
  }
}
```

### **Uso en Android**
1. Obtén la `download_url`
2. Descarga el archivo usando `DownloadManager` o biblioteca HTTP
3. Guarda en el almacenamiento del dispositivo
4. Abre con Intent apropiado según el `file_type`

---

## 6️⃣ **Eliminar un Archivo**

### **Endpoint**
```
DELETE /api/attachments/{attachmentId}
```

### **Descripción**
Elimina un archivo adjunto (soft delete).

### **Permisos**
Solo pueden eliminar:
- El creador del ticket
- Administradores

### **Response Success (200 OK)**
```json
{
  "success": true,
  "message": "Archivo eliminado exitosamente"
}
```

### **Response Error (403 Forbidden)**
```json
{
  "success": false,
  "message": "No tienes permisos para eliminar este archivo"
}
```

---

## 📁 **Tipos de Archivo Permitidos**

### **Imágenes**
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/gif` (.gif)
- `image/webp` (.webp)

### **Documentos**
- `application/pdf` (.pdf)
- `application/msword` (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- `application/vnd.ms-excel` (.xls)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)
- `text/plain` (.txt)

### **Videos**
- `video/mp4` (.mp4)
- `video/quicktime` (.mov)
- `video/x-msvideo` (.avi)

### **Límites**
- Tamaño máximo por archivo: **10MB**
- Archivos por request múltiple: **5 archivos**

---

## ⚠️ **Códigos de Error**

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 400 | No se proporcionó ningún archivo | No se envió el campo `file` |
| 400 | Tipo de archivo no permitido | El MIME type no está en la lista permitida |
| 403 | No tienes permisos... | Usuario sin permisos para el ticket |
| 404 | Ticket no encontrado | El ticketId no existe |
| 404 | Archivo no encontrado | El attachmentId no existe |
| 413 | Payload too large | Archivo excede 10MB |
| 500 | Error al subir el archivo | Error del servidor |

---

## 📱 **Ejemplos de Implementación Android**

### **Retrofit Interface**
```kotlin
interface AttachmentApiService {
    
    @Multipart
    @POST("tickets/{ticketId}/attachments")
    suspend fun uploadAttachment(
        @Path("ticketId") ticketId: Int,
        @Part file: MultipartBody.Part,
        @Part("description") description: RequestBody?
    ): Response<AttachmentResponse>
    
    @Multipart
    @POST("tickets/{ticketId}/attachments/multiple")
    suspend fun uploadMultipleAttachments(
        @Path("ticketId") ticketId: Int,
        @Part files: List<MultipartBody.Part>
    ): Response<MultipleAttachmentsResponse>
    
    @GET("tickets/{ticketId}/attachments")
    suspend fun getTicketAttachments(
        @Path("ticketId") ticketId: Int
    ): Response<AttachmentsListResponse>
    
    @GET("attachments/{id}")
    suspend fun getAttachmentById(
        @Path("id") attachmentId: Int
    ): Response<AttachmentDetailResponse>
    
    @GET("attachments/{id}/download")
    suspend fun getDownloadUrl(
        @Path("id") attachmentId: Int
    ): Response<DownloadUrlResponse>
    
    @DELETE("attachments/{id}")
    suspend fun deleteAttachment(
        @Path("id") attachmentId: Int
    ): Response<DeleteResponse>
}
```

### **Repository Example**
```kotlin
class AttachmentRepository(
    private val apiService: AttachmentApiService
) {
    
    suspend fun uploadFile(
        ticketId: Int,
        file: File,
        description: String? = null
    ): Result<Attachment> {
        return try {
            // Detectar MIME type
            val mimeType = getMimeType(file)
            val requestFile = file.asRequestBody(mimeType.toMediaType())
            val filePart = MultipartBody.Part.createFormData(
                "file", 
                file.name, 
                requestFile
            )
            
            val descriptionPart = description?.toRequestBody("text/plain".toMediaType())
            
            val response = apiService.uploadAttachment(ticketId, filePart, descriptionPart)
            
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()!!.data)
            } else {
                Result.failure(Exception(response.body()?.message ?: "Error desconocido"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private fun getMimeType(file: File): String {
        val extension = file.extension.lowercase()
        return when (extension) {
            "jpg", "jpeg" -> "image/jpeg"
            "png" -> "image/png"
            "gif" -> "image/gif"
            "pdf" -> "application/pdf"
            "mp4" -> "video/mp4"
            else -> "application/octet-stream"
        }
    }
}
```

### **ViewModel Example**
```kotlin
class TicketDetailViewModel(
    private val attachmentRepository: AttachmentRepository
) : ViewModel() {
    
    private val _uploadState = MutableStateFlow<UploadState>(UploadState.Idle)
    val uploadState: StateFlow<UploadState> = _uploadState.asStateFlow()
    
    fun uploadAttachment(ticketId: Int, file: File, description: String? = null) {
        viewModelScope.launch {
            _uploadState.value = UploadState.Loading
            
            val result = attachmentRepository.uploadFile(ticketId, file, description)
            
            _uploadState.value = when {
                result.isSuccess -> UploadState.Success(result.getOrNull()!!)
                else -> UploadState.Error(result.exceptionOrNull()?.message ?: "Error")
            }
        }
    }
}

sealed class UploadState {
    object Idle : UploadState()
    object Loading : UploadState()
    data class Success(val attachment: Attachment) : UploadState()
    data class Error(val message: String) : UploadState()
}
```

---

## ✅ **Checklist de Implementación**

- [ ] Crear interface de Retrofit con todos los endpoints
- [ ] Implementar Repository para attachments
- [ ] Crear ViewModel para manejo de estado
- [ ] Implementar UI para seleccionar archivos
- [ ] Implementar progress bar para subida
- [ ] Mostrar preview de imágenes antes de subir
- [ ] Validar tamaño de archivo (< 10MB)
- [ ] Validar tipo de archivo (solo permitidos)
- [ ] Implementar retry para fallos de red
- [ ] Mostrar lista de archivos del ticket
- [ ] Implementar descarga de archivos
- [ ] Abrir archivos con Intent apropiado
- [ ] Implementar eliminación de archivos
- [ ] Manejo de errores y mensajes al usuario

---

## 🚀 **Próximos Pasos**

1. **Probar endpoints** con Postman usando ejemplos de esta documentación
2. **Implementar en Android** siguiendo los ejemplos de código
3. **Validar** tipos de archivo y tamaños antes de enviar
4. **Manejar errores** apropiadamente en la UI

---

**🔗 URL Base de API:** `http://api.mactickets.com/api`  
**📧 Soporte:** soporte@maccomputadoras.com  
**📅 Última actualización:** 16 de Octubre, 2025

