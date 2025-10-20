# ✅ Guía de Pruebas - Datos Reales en Android

## 🎯 Objetivo

Verificar que la aplicación Android esté conectada correctamente al backend y use **datos reales** en lugar de datos mock.

---

## 📋 Checklist Pre-Pruebas

### 1. Backend debe estar corriendo

```bash
cd MAC/mac-tickets-api
npm start
```

Debes ver:
```
🚀 Servidor corriendo en: http://0.0.0.0:3001
✅ Base de datos conectada correctamente
```

### 2. Configurar ApiConfig.kt

Edita: `app/src/main/java/mx/tec/prototipo_01/config/ApiConfig.kt`

Para **emulador**:
```kotlin
private val CURRENT_ENVIRONMENT = Environment.EMULATOR
```

Para **dispositivo físico**:
```kotlin
private val CURRENT_ENVIRONMENT = Environment.PHYSICAL_DEVICE

// Y actualiza tu IP local:
private const val PHYSICAL_DEVICE_BASE_URL = "http://TU_IP_AQUI:3001/api/"
```

### 3. Rebuild del proyecto

En Android Studio:
- Build → Clean Project
- Build → Rebuild Project

---

## 🧪 Pruebas por Funcionalidad

### 1. ✅ Prueba de Login

**Objetivo:** Verificar autenticación con datos reales

**Pasos:**
1. Abre la app
2. Usa credenciales reales del backend:
   - **Técnico:** `tecnico1@maccomputadoras.com` / `Tecnico123!`
   - **Mesa:** `mesa1@maccomputadoras.com` / `Mesa123!`
3. Presiona "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Redirección a home según rol
- ✅ Token JWT guardado en `TokenStore`

**Si falla:**
- Verifica que el backend esté corriendo
- Revisa logs en Logcat (busca "LoginViewModel")
- Verifica la URL en `ApiConfig.kt`

---

### 2. ✅ Prueba de Carga de Tickets (Técnico)

**Objetivo:** Verificar que se cargan tickets reales de la BD

**Pasos:**
1. Login como técnico
2. Observa la lista de "Mis Tickets"

**Resultado Esperado:**
- ✅ Se muestran tickets **asignados** al técnico
- ✅ Datos reales: título, empresa, prioridad, estado
- ✅ NO hay datos mock ("Problema con impresora", etc.)

**Verificación en Logcat:**
```
TecnicoSharedViewModel: Loading tickets...
TecnicoSharedViewModel: Loaded X tickets successfully
```

**Si falla:**
- Verifica en Logcat: "Error loading tickets: ..."
- Verifica que el técnico tenga tickets asignados en la BD
- Prueba el endpoint en Postman: `GET http://localhost:3001/api/tickets`

---

### 3. ✅ Prueba de Creación de Ticket (Mesa de Trabajo)

**Objetivo:** Crear ticket que se guarde en la base de datos real

**Pasos:**
1. Login como mesa de trabajo
2. Presiona el botón "+" (crear ticket)
3. Llena el formulario:
   - **Nombre:** "Prueba Android - [Tu nombre]"
   - **Compañía:** "Empresa Test"
   - **Prioridad:** Selecciona una (las opciones vienen del backend)
   - **Categoría:** Selecciona una
   - **Técnico:** Selecciona uno
   - **Descripción:** "Ticket de prueba desde Android"
4. Presiona "Crear Ticket"

**Resultado Esperado:**
- ✅ Toast: "Ticket creado y asignado"
- ✅ Redirección a la lista
- ✅ El nuevo ticket aparece en la lista
- ✅ El ticket está en la base de datos (verifica en dashboard web)

**Verificación adicional:**
- Abre el dashboard web
- Ve a la lista de tickets
- Busca el ticket recién creado
- Debe aparecer con los mismos datos

---

### 4. ✅ Prueba de Aceptar/Rechazar Ticket (Técnico)

**Objetivo:** Cambiar estados de tickets reales

**Pasos:**
1. Login como técnico
2. Selecciona un ticket en estado "Pendiente"
3. Presiona "Ver Detalles"
4. Presiona "Aceptar"

**Resultado Esperado:**
- ✅ El ticket cambia a estado "En Proceso"
- ✅ El cambio se refleja en la lista
- ✅ El cambio está en la BD (verifica en dashboard web)

**Prueba de Rechazo:**
1. Selecciona otro ticket en "Pendiente"
2. Presiona "Rechazar"
3. Ingresa motivo de rechazo
4. Confirma

**Resultado Esperado:**
- ✅ El ticket cambia a estado "Rechazado"
- ✅ El motivo se guarda en la BD
- ✅ Aparece en la lista de Mesa de Trabajo para reasignar

---

### 5. ✅ Prueba de Cerrar Ticket (Técnico)

**Objetivo:** Marcar ticket como resuelto

**Pasos:**
1. Login como técnico
2. Selecciona un ticket en estado "En Proceso"
3. Presiona "Ver Detalles"
4. Presiona "Cerrar Ticket"
5. Confirma en el diálogo

**Resultado Esperado:**
- ✅ El ticket cambia a estado "Resuelto"/"Completado"
- ✅ Aparece en "Tickets pasados"
- ✅ Ya no aparece en "Mis Tickets"
- ✅ El cambio está en la BD

---

### 6. ✅ Prueba de Asignación (Mesa de Trabajo)

**Objetivo:** Asignar ticket a técnico

**Pasos:**
1. Login como mesa de trabajo
2. Crea un ticket PERO no selecciones técnico
3. Después de crear, el ticket queda sin asignar
4. Desde el dashboard web, verifica que no tenga técnico asignado

**Asignación posterior:**
1. En Android, ve al ticket
2. Si está rechazado, selecciona técnico del dropdown
3. Presiona "Reasignar"

**Resultado Esperado:**
- ✅ El ticket se asigna al técnico seleccionado
- ✅ El técnico lo ve en su lista "Mis Tickets"
- ✅ El cambio está en la BD

---

### 7. ✅ Prueba de Adjuntos

**Objetivo:** Subir archivos reales al servidor

**Pasos:**
1. Login como técnico
2. Abre un ticket en "En Proceso"
3. Presiona "Adjuntar evidencias"
4. Presiona "Subir imagen" o "Subir PDF"
5. Selecciona un archivo de tu dispositivo

**Resultado Esperado:**
- ✅ El archivo se sube al servidor
- ✅ Aparece en la lista de adjuntos
- ✅ Puedes ver la miniatura (si es imagen)
- ✅ El archivo está en `/uploads` del servidor
- ✅ Se puede ver desde el dashboard web

---

### 8. ✅ Prueba de Catálogos

**Objetivo:** Verificar que los dropdowns usen datos reales

**Pasos:**
1. Login como mesa de trabajo
2. Presiona "+" para crear ticket
3. Observa los dropdowns:
   - Prioridades
   - Categorías
   - Técnicos

**Resultado Esperado:**
- ✅ Las opciones vienen del backend (no son datos mock)
- ✅ Los nombres coinciden con los del dashboard web
- ✅ Los colores coinciden (si aplica)

**Verificación:**
- En Postman, llama: `GET http://localhost:3001/api/catalog/priorities`
- Compara los nombres con lo que ves en la app

---

### 9. ✅ Prueba de Filtrado por Rol

**Objetivo:** Verificar que cada rol vea solo sus tickets

**Prueba con Técnico:**
1. Login como `tecnico1@maccomputadoras.com`
2. Ve "Mis Tickets"

**Debe ver:**
- ✅ SOLO tickets asignados a él
- ❌ NO debe ver tickets de otros técnicos
- ❌ NO debe ver tickets sin asignar

**Prueba con Mesa:**
1. Login como `mesa1@maccomputadoras.com`
2. Ve "Tickets"

**Debe ver:**
- ✅ Tickets creados por él
- ✅ Tickets sin asignar
- ✅ Tickets rechazados (para reasignar)

---

### 10. ✅ Prueba de Sincronización

**Objetivo:** Verificar que los cambios se reflejen entre Android y Web

**Pasos:**
1. Abre el dashboard web en tu navegador
2. Abre la app Android
3. En Android: Acepta un ticket
4. En Web: Refresca la lista de tickets

**Resultado Esperado:**
- ✅ El cambio se refleja inmediatamente en web
- ✅ Ambas plataformas muestran los mismos datos
- ✅ El historial de cambios se registra correctamente

---

## 🔍 Verificación de Datos en BD

Después de cada prueba, puedes verificar en MySQL:

```sql
-- Ver tickets creados desde Android
SELECT 
    id, 
    ticket_number, 
    title, 
    status_id,
    assigned_to,
    created_at
FROM tickets
ORDER BY created_at DESC
LIMIT 10;

-- Ver adjuntos subidos
SELECT 
    id, 
    ticket_id, 
    original_name, 
    s3_url,
    created_at
FROM ticket_attachments
ORDER BY created_at DESC
LIMIT 10;

-- Ver historial de cambios
SELECT 
    th.id,
    th.ticket_id,
    th.action_type,
    th.old_value,
    th.new_value,
    u.username,
    th.created_at
FROM ticket_history th
JOIN users u ON th.user_id = u.id
ORDER BY th.created_at DESC
LIMIT 20;
```

---

## 📊 Monitoreo en Logcat

Filtros útiles en Android Studio Logcat:

### Ver requests HTTP:
```
Tag: RetrofitClient
```

### Ver errores de ViewModel:
```
Tag: TecnicoSharedViewModel
Tag: MesaAyudaSharedViewModel
```

### Ver errores de login:
```
Tag: LoginViewModel
```

### Ver todo relacionado con la app:
```
Package: mx.tec.prototipo_01
```

---

## ⚠️ Errores Comunes

### "Unable to resolve host"
**Causa:** No puede conectar al servidor
**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica la IP en `ApiConfig.kt`
3. Prueba en el navegador del dispositivo

### "401 Unauthorized"
**Causa:** Token inválido o expirado
**Solución:**
- Cierra sesión y vuelve a entrar

### "Connection timeout"
**Causa:** El servidor tarda mucho en responder
**Solución:**
- Aumenta timeouts en `ApiConfig.kt`
- Verifica la conexión de red

### "NetworkOnMainThreadException"
**Causa:** Llamada de red en hilo principal
**Solución:**
- Ya está resuelto usando `viewModelScope.launch`
- Si ves este error, reporta el stack trace

### Los datos no se actualizan
**Causa:** Cache o estado viejo
**Solución:**
1. Pull to refresh en la lista
2. O limpia datos de la app en Settings

---

## 🎉 Confirmación Final

**La app usa datos reales si:**

✅ Los tickets que ves en Android son los mismos que en el dashboard web
✅ Al crear un ticket en Android, aparece en el dashboard web
✅ Los cambios de estado se reflejan en ambos lados
✅ Los archivos adjuntos se pueden ver en ambas plataformas
✅ Las prioridades y categorías coinciden con la BD

**Si TODO esto funciona, la integración está completa** 🎊

---

## 📝 Próximos Pasos

Con datos reales funcionando, puedes:

1. **Implementar comentarios en la UI**
   - Ya existe el endpoint
   - Falta la pantalla de chat funcional

2. **Mejorar la experiencia de adjuntos**
   - Previsualización de imágenes
   - Descarga de archivos

3. **Notificaciones push**
   - Cuando se asigne un ticket
   - Cuando cambie el estado

4. **Sincronización en tiempo real**
   - WebSockets para actualizaciones live

5. **Caché local**
   - Para trabajar offline
   - Sincronizar cuando vuelva la conexión

---

## 🐛 Reportar Problemas

Si encuentras algún problema, incluye:

1. **Logs de Logcat** (filtrados por la app)
2. **Endpoint que falla** (de ApiService.kt)
3. **Código de error HTTP** (200, 400, 500, etc.)
4. **Cuerpo de la respuesta** (si está disponible)
5. **Pasos para reproducir**

**Formato de reporte:**
```
Endpoint: POST /tickets/{id}/accept
Error: 500 Internal Server Error
Logs: [pegar logs aquí]
Pasos: 
1. Login como técnico
2. Seleccionar ticket
3. Presionar Aceptar
```

---

¡Éxito con las pruebas! 🚀

