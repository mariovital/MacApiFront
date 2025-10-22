# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto **MAC Tickets System**!

## 📋 Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

## 🚀 Cómo Contribuir

### 1. **Fork y Clone**

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/MacApiFront.git
cd MacApiFront
```

### 2. **Crear una Rama**

```bash
# Crear rama para tu feature o fix
git checkout -b feature/nueva-funcionalidad
# O para un bug fix
git checkout -b fix/corregir-error
```

### 3. **Hacer Cambios**

- Sigue las reglas de desarrollo en [`Docs/DEVELOPMENT-RULES.md`](Docs/DEVELOPMENT-RULES.md)
- Escribe código limpio y bien documentado
- Agrega tests cuando sea apropiado
- Actualiza la documentación si es necesario

### 4. **Commit**

Usa commits descriptivos siguiendo este formato:

```bash
git commit -m "tipo: descripcion breve

Descripcion detallada opcional"
```

**Tipos de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Cambios en documentación
- `style:` Formato de código
- `refactor:` Refactorización
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: agregar filtro por fecha en tickets"
git commit -m "fix: corregir error de autenticacion en Android"
git commit -m "docs: actualizar guia de instalacion"
```

### 5. **Push y Pull Request**

```bash
# Push a tu fork
git push origin feature/nueva-funcionalidad

# Ir a GitHub y crear Pull Request
```

## 📝 Estándares de Código

### **Frontend (React)**
- Componentes en PascalCase: `TicketCard.jsx`
- Variables y funciones en camelCase: `handleSubmit`
- Usar TailwindCSS + Material-UI (MUI)
- NO usar styled-components o CSS custom
- Context API para estado global
- React Icons para iconos

### **Backend (Node.js)**
- Archivos en camelCase: `ticketController.js`
- Usar Express.js y Sequelize
- Validación con Joi
- Respuestas API en formato estándar
- Comentarios solo cuando sea necesario

### **Android (Kotlin)**
- Arquitectura Clean + MVVM
- Jetpack Compose para UI
- Hilt para inyección de dependencias
- Room para base de datos local
- Coroutines para asincronía

## 🧪 Testing

Antes de hacer Pull Request:

### **Backend**
```bash
cd MAC/mac-tickets-api
npm test
npm run lint
```

### **Frontend**
```bash
cd MAC/mac-tickets-front
npm test
npm run lint
```

### **Android**
```bash
cd Android/Mac_Android
./gradlew test
./gradlew lint
```

## 📚 Documentación

Si agregas nuevas funcionalidades:

- ✅ Actualiza el README si es necesario
- ✅ Documenta nuevos endpoints en `ENDPOINTS-REFERENCE.md`
- ✅ Agrega comentarios en código complejo
- ✅ Actualiza los schemas SQL si modificas la BD

## 🔍 Revisión de Pull Requests

Tu Pull Request será revisado considerando:

1. **Funcionalidad:** ¿El código hace lo que debe?
2. **Calidad:** ¿El código es limpio y mantenible?
3. **Tests:** ¿Hay tests adecuados?
4. **Documentación:** ¿Está documentado correctamente?
5. **Estándares:** ¿Sigue las reglas del proyecto?

## ❌ Qué NO Hacer

- ❌ NO incluir credenciales o datos sensibles
- ❌ NO subir archivos `.env` o `local.properties`
- ❌ NO hacer commit de `node_modules/` o `build/`
- ❌ NO usar tecnologías no aprobadas
- ❌ NO hacer force push a main/master
- ❌ NO skip hooks (--no-verify)

## 🐛 Reportar Bugs

Para reportar un bug:

1. Ir a [GitHub Issues](https://github.com/tu-usuario/MacApiFront/issues)
2. Crear un "New Issue"
3. Usar la plantilla de bug report
4. Incluir:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es relevante
   - Versión del sistema
   - Logs de error

## 💡 Sugerir Funcionalidades

Para sugerir una nueva funcionalidad:

1. Verificar que no exista ya en Issues
2. Crear un "New Issue"
3. Usar la plantilla de feature request
4. Describir:
   - Problema que resuelve
   - Solución propuesta
   - Alternativas consideradas
   - Contexto adicional

## 📞 Preguntas

Si tienes preguntas:

- 📧 Email: soporte@maccomputadoras.com
- 💬 GitHub Discussions
- 📖 Revisar la [documentación](Docs/)

## 🙏 Agradecimientos

¡Gracias por contribuir a MAC Tickets System!

Tu ayuda hace que este proyecto sea mejor para todos.

---

**¿Listo para contribuir?** ¡Adelante! 🚀

