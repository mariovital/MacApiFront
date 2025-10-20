# 🚀 Prueba Rápida - Sistema de PDF para Firma

## ✅ **Pasos para Probar**

### **1. Reiniciar el Backend**

```bash
cd MAC/mac-tickets-api
npm start
```

### **2. Reiniciar el Frontend**

```bash
cd MAC/mac-tickets-front
npm run dev
```

### **3. Probar desde el Dashboard Web**

1. **Login:** http://localhost:5173/login
   - Usuario: `admin` / Contraseña: `admin123`

2. **Ir a un ticket Resuelto o Cerrado:**
   - Navegar a "Tickets"
   - Abrir cualquier ticket en estado **Resuelto** (5) o **Cerrado** (6)

3. **Generar PDF:**
   - Buscar el botón "**Generar PDF**" (azul)
   - Click en el botón
   - El PDF debe descargarse automáticamente

4. **Verificar contenido del PDF:**
   - Abrir el PDF descargado
   - Verificar que incluye:
     - ✅ Header con logo MAC
     - ✅ Número de ticket
     - ✅ Información general (fechas, categoría, prioridad)
     - ✅ Datos del cliente
     - ✅ Técnico responsable
     - ✅ Descripción del problema
     - ✅ Solución aplicada (si existe)
     - ✅ Archivos adjuntos (lista)
     - ✅ Historial de cambios
     - ✅ Campos de firma vacíos
     - ✅ Footer con fecha de generación

### **4. Probar desde Postman**

**Endpoint:** `GET http://localhost:3001/api/pdf/ticket/1`

**Headers:**
```
Authorization: Bearer {tu_token_jwt_aqui}
```

**Respuesta esperada:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- El PDF se descarga directamente

---

## 🔍 **Verificar Base de Datos**

```sql
-- Ver si se actualizó el registro
SELECT 
    id, 
    ticket_number, 
    pdf_generated_at, 
    pdf_generated_count 
FROM tickets 
WHERE id = 1;
```

**Resultado esperado:**
- `pdf_generated_at`: Fecha y hora actual
- `pdf_generated_count`: Incrementado en 1

---

## 🐛 **Problemas Comunes**

### **Error: "Cannot find module 'pdfkit'"**
**Solución:**
```bash
cd MAC/mac-tickets-api
npm install pdfkit
npm start
```

### **Error: "Botón no aparece en el frontend"**
**Verificar:**
1. El ticket está en estado Resuelto (5) o Cerrado (6)
2. El componente `GeneratePDFButton` está importado
3. No hay errores en la consola del navegador

### **Error: "403 Forbidden"**
**Verificar:**
- Técnico: Solo puede generar PDF de sus tickets asignados
- Mesa de Trabajo: Solo de sus tickets creados
- Admin: Puede generar de cualquier ticket

### **Error: "PDF descarga pero está vacío o corrupto"**
**Verificar:**
1. Backend está sirviendo el PDF correctamente
2. Frontend está usando `responseType: 'blob'`
3. No hay errores en la consola del servidor

---

## ✅ **Checklist de Verificación**

- [ ] Backend inicia sin errores
- [ ] Frontend inicia sin errores
- [ ] Botón "Generar PDF" visible en tickets Resueltos/Cerrados
- [ ] Click en botón descarga el PDF automáticamente
- [ ] PDF se abre correctamente
- [ ] PDF contiene toda la información esperada
- [ ] Campos de firma están vacíos y listos para imprimir
- [ ] Base de datos actualiza `pdf_generated_at` y `pdf_generated_count`
- [ ] Múltiples descargas incrementan el contador

---

## 📱 **Siguiente Paso: Android**

Una vez verificado que funciona en el Dashboard Web, seguir los pasos en:

**Documento:** `FEATURE-PDF-SIGNATURE.md` > Sección "Implementación en Android"

---

**Última actualización:** 20 de enero de 2025

