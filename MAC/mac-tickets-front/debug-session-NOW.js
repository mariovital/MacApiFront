// DEBUG INMEDIATO - Ejecuta esto en la consola DESPUÉS de login

console.clear();
console.log('%c🔍 DEBUG: ESTADO ACTUAL DE LA SESIÓN', 'background: #E31E24; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('');

// 1. Verificar localStorage
console.log('%c1️⃣ localStorage:', 'color: #3B82F6; font-weight: bold; font-size: 14px;');
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const refreshToken = localStorage.getItem('refreshToken');

console.log('Token:', token ? '✅ EXISTS' : '❌ MISSING');
if (token) {
  console.log('  → Length:', token.length);
  console.log('  → First 30 chars:', token.substring(0, 30) + '...');
}

console.log('User:', user ? '✅ EXISTS' : '❌ MISSING');
if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('  → Email:', userData.email);
    console.log('  → Role:', userData.role);
    console.log('  → Full data:', userData);
  } catch (e) {
    console.log('  → ❌ ERROR parsing:', e.message);
  }
}

console.log('Refresh Token:', refreshToken ? '✅ EXISTS' : '⚠️  MISSING');
console.log('');

// 2. Monitorear ANTES de refresh
console.log('%c2️⃣ CONFIGURANDO MONITORES:', 'color: #3B82F6; font-weight: bold; font-size: 14px;');

window.addEventListener('beforeunload', () => {
  console.log('%c📤 BEFORE UNLOAD (justo antes de refresh):', 'background: #F59E0B; color: white; padding: 5px; font-weight: bold;');
  console.log('Token:', localStorage.getItem('token') ? '✅ STILL EXISTS' : '❌ DISAPPEARED');
  console.log('User:', localStorage.getItem('user') ? '✅ STILL EXISTS' : '❌ DISAPPEARED');
});

// 3. Monitorear DESPUÉS de refresh (se ejecutará al recargar)
if (window.performance) {
  const perfData = performance.getEntriesByType('navigation')[0];
  if (perfData && perfData.type === 'reload') {
    console.log('%c📥 AFTER RELOAD (acabas de hacer refresh):', 'background: #10B981; color: white; padding: 5px; font-weight: bold;');
    console.log('Token después de reload:', localStorage.getItem('token') ? '✅ EXISTS' : '❌ MISSING');
    console.log('User después de reload:', localStorage.getItem('user') ? '✅ EXISTS' : '❌ MISSING');
  }
}

console.log('✅ Monitores configurados');
console.log('');

// 4. Instrucciones
console.log('%c3️⃣ AHORA HAZ REFRESH (F5 o Cmd+R):', 'color: #E31E24; font-weight: bold; font-size: 14px;');
console.log('   → Mantén esta consola abierta');
console.log('   → Observa los mensajes que aparecen');
console.log('   → Después del refresh, ejecuta: checkAfterRefresh()');
console.log('');

// 5. Función de verificación post-refresh
window.checkAfterRefresh = () => {
  console.clear();
  console.log('%c🔍 VERIFICACIÓN POST-REFRESH', 'background: #10B981; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
  console.log('');
  
  const tokenAfter = localStorage.getItem('token');
  const userAfter = localStorage.getItem('user');
  
  console.log('Token:', tokenAfter ? '✅ EXISTS' : '❌ MISSING');
  console.log('User:', userAfter ? '✅ EXISTS' : '❌ MISSING');
  
  if (tokenAfter && userAfter) {
    console.log('%c✅ DATOS PRESENTES - Sesión debería estar activa', 'color: #10B981; font-weight: bold;');
    console.log('');
    console.log('Si te redirigió al login, el problema está en el código de React');
  } else {
    console.log('%c❌ DATOS PERDIDOS - localStorage se borró', 'color: #EF4444; font-weight: bold;');
    console.log('');
    console.log('El problema es que localStorage se está limpiando durante el refresh');
  }
  
  // Verificar si estamos en login o dashboard
  console.log('');
  console.log('URL actual:', window.location.pathname);
  console.log('');
  
  if (window.location.pathname === '/login' && tokenAfter && userAfter) {
    console.log('%c⚠️  PROBLEMA DETECTADO:', 'background: #F59E0B; color: white; padding: 5px; font-weight: bold;');
    console.log('Tienes token y user, pero estás en /login');
    console.log('Esto significa que React está redirigiendo incorrectamente');
  }
};

console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280;');

