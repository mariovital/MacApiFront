// Script para limpiar caché y forzar recarga
// Ejecuta esto en la consola del navegador (F12)

console.log('🧹 Limpiando caché y localStorage...');

// 1. Limpiar localStorage completamente
localStorage.clear();
console.log('✅ localStorage limpiado');

// 2. Limpiar sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage limpiado');

// 3. Recargar con forzar actualización de caché
console.log('🔄 Recargando página (hard refresh)...');
location.reload(true);

