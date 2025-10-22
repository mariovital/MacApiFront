# ⚡ SOLUCIÓN INMEDIATA - Categorías Vacías

## 🎯 **1 Comando - 3 Minutos**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas && ./insert-seed-data.sh
```

**¿Qué inserta?**
- ✅ 7 Categorías (Hardware, Software, Red, etc.)
- ✅ 4 Prioridades
- ✅ 7 Estados
- ✅ 6 Usuarios de prueba

---

## 📋 **Credenciales Después de Insertar**

### **Admin**
```
Username: admin
Password: Admin123
```

### **Técnicos** (Password: Tecnico123)
```
- jtecnico
- mtecnico
- ctecnico
```

---

## 🔄 **Después de Insertar**

```bash
cd ../../MAC/mac-tickets-api
eb restart
```

Espera 30 segundos, recarga el frontend y prueba crear ticket.

---

## ✅ **Verificación Rápida**

```bash
# Ver categorías
curl http://tu-app.elasticbeanstalk.com/api/catalog/categories \
  -H "Authorization: Bearer TU_TOKEN"

# Debe responder con 7 categorías
```

---

**¿Problema?** Ver: [FIX-CATEGORIAS-VACIAS.md](FIX-CATEGORIAS-VACIAS.md)

