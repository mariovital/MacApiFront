# 🎫 Guía: Cómo Cerrar Tickets según tu Rol

## ⚠️ IMPORTANTE: Flujo de Cierre de Tickets

### **El flujo correcto es:**
```
Nuevo → Asignado → En Proceso → Resuelto (técnico) → Cerrado (admin)
```

---

## 👨‍🔧 **TÉCNICO - Lo que PUEDES hacer**

### ✅ **Marcar como Resuelto**
Cuando termines tu trabajo en un ticket:

**Requisitos:**
- ✅ El ticket debe estar en estado "En Proceso"
- ✅ Debes ser el técnico asignado
- ✅ El ticket debe tener al menos un comentario

**Pasos:**
1. Abre el ticket en detalle
2. Busca el botón verde **"Marcar como Resuelto"** en la sección "Acciones del Ticket"
3. Se abrirá un modal donde debes:
   - Escribir comentario de resolución (mínimo 10 caracteres)
   - Opcionalmente subir evidencia (foto, documento, etc.)
4. Click en "Marcar como Resuelto"
5. ✅ El ticket cambia a estado **"Resuelto"**

**Ejemplo de comentario:**
```
"Se reemplazó el cable de red defectuoso. 
La impresora ahora imprime correctamente. 
Pruebas realizadas exitosamente."
```

---

### ❌ **Lo que NO PUEDES hacer como Técnico**

**NO puedes cerrar tickets directamente**
- ❌ No hay botón "Cerrar Ticket" para técnicos
- ❌ Solo puedes marcar como "Resuelto"
- ✅ El administrador es quien cierra los tickets

**¿Por qué?**
- El administrador debe verificar que el cliente esté satisfecho
- El administrador confirma que todo esté en orden antes de cerrar
- Permite un control de calidad adicional

---

## 👨‍💼 **ADMINISTRADOR - Cerrar Tickets**

### ✅ **Cerrar Ticket**

**Requisitos:**
- ✅ Debes ser administrador
- ✅ El ticket debe estar en estado "Resuelto"

**Pasos:**
1. Abre el ticket en detalle
2. Busca el botón azul **"Cerrar Ticket"** en la sección "Acciones del Ticket"
3. Se abrirá un modal donde puedes:
   - Escribir razón de cierre (opcional)
4. Click en "Cerrar Ticket"
5. ✅ El ticket cambia a estado **"Cerrado"**

**Ejemplo de razón:**
```
"Cliente confirmó que el problema está solucionado.
Verificación final completada."
```

---

### ✅ **Reabrir Ticket**

Si un problema vuelve a ocurrir:

**Requisitos:**
- ✅ Debes ser administrador
- ✅ El ticket debe estar en estado "Cerrado"

**Pasos:**
1. Abre el ticket cerrado
2. Busca el botón naranja **"Reabrir Ticket"**
3. Se abrirá un modal donde debes:
   - Escribir razón de reapertura (obligatorio, mínimo 10 caracteres)
4. Click en "Reabrir Ticket"
5. ✅ El ticket cambia a estado **"Reabierto"**

**Ejemplo de razón:**
```
"Cliente reporta que el problema volvió a ocurrir.
Requiere nueva revisión técnica."
```

---

## 🎯 **Estados de Tickets**

| Estado | ID | Color | Quién lo asigna | Siguiente Paso |
|--------|-----|-------|-----------------|----------------|
| **Nuevo** | 1 | Gris | Sistema automático | Admin asigna a técnico |
| **Asignado** | 2 | Azul | Admin | Técnico acepta y empieza |
| **En Proceso** | 3 | Naranja | Técnico | Técnico marca como resuelto |
| **Resuelto** | 5 | Verde | Técnico | Admin cierra el ticket |
| **Cerrado** | 6 | Gris | Admin | (Final) o Admin reabre |
| **Reabierto** | 7 | Rojo | Admin | Técnico vuelve a trabajar |

---

## 🔍 **Ejemplos de Flujo Completo**

### **Caso 1: Ticket Exitoso**
1. 🆕 Cliente crea ticket: **"Impresora no funciona"** → Estado: Nuevo
2. 👨‍💼 Admin asigna a Juan (técnico) → Estado: Asignado
3. 👨‍🔧 Juan acepta y empieza a trabajar → Estado: En Proceso
4. 👨‍🔧 Juan soluciona y marca como resuelto: "Cambié cable USB" → Estado: Resuelto
5. 👨‍💼 Admin verifica y cierra: "Cliente confirmó solución" → Estado: Cerrado
6. ✅ **TICKET FINALIZADO**

### **Caso 2: Ticket Reabierto**
1. 🆕 Ticket cerrado: **"Impresora arreglada"** → Estado: Cerrado
2. 📞 Cliente llama: "La impresora dejó de funcionar de nuevo"
3. 👨‍💼 Admin reabre: "Problema recurrente" → Estado: Reabierto
4. 👨‍💼 Admin reasigna a técnico → Estado: En Proceso
5. 👨‍🔧 Técnico investiga y soluciona → Estado: Resuelto
6. 👨‍💼 Admin verifica y cierra → Estado: Cerrado
7. ✅ **TICKET FINALIZADO**

---

## 🚫 **Errores Comunes**

### ❌ "No puedo cerrar el ticket como técnico"
**Respuesta:** ✅ Es correcto! Los técnicos solo marcan como "Resuelto", NO cierran.

### ❌ "No veo el botón Marcar como Resuelto"
**Posibles causas:**
1. El ticket NO está en estado "En Proceso"
2. NO eres el técnico asignado a ese ticket
3. El ticket NO tiene comentarios (agrega al menos uno)

### ❌ "No veo el botón Cerrar Ticket"
**Posibles causas:**
1. NO eres administrador
2. El ticket NO está en estado "Resuelto"

### ❌ Error 500 al abrir ticket
**Solución:**
1. Refresca el navegador (F5)
2. Limpia caché y cookies
3. Verifica que el backend esté corriendo
4. Contacta al administrador del sistema

---

## 📞 **¿Necesitas Ayuda?**

### **Como Técnico:**
- Si no puedes marcar como resuelto → Contacta al administrador
- Si el ticket no está asignado a ti → Solicita reasignación al admin
- Si no tienes permisos → Verifica tu rol con admin

### **Como Admin:**
- Puedes hacer todo lo que hace un técnico
- Además puedes cerrar y reabrir tickets
- Puedes reasignar tickets entre técnicos

---

## ✅ **Resumen Rápido**

| Acción | Técnico | Admin | Mesa de Trabajo |
|--------|---------|-------|-----------------|
| **Crear ticket** | ❌ | ✅ | ✅ |
| **Asignar ticket** | ❌ | ✅ | ❌ |
| **Aceptar asignación** | ✅ | ✅ | ❌ |
| **Cambiar a En Proceso** | ✅ | ✅ | ❌ |
| **Marcar como Resuelto** | ✅ | ✅ | ❌ |
| **Cerrar ticket** | ❌ | ✅ | ❌ |
| **Reabrir ticket** | ❌ | ✅ | ❌ |
| **Ver comentarios** | ✅ | ✅ | ✅ (solo públicos) |
| **Agregar comentarios** | ✅ | ✅ | ✅ |
| **Comentarios internos** | ✅ | ✅ | ❌ |

---

**Fecha de creación**: Enero 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Documentación Oficial

