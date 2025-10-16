// Script de prueba para verificar persistencia de sesión
// Ejecuta esto en la consola del navegador (F12)

console.log('%c🧪 TEST: SESSION PERSISTENCE', 'background: #E31E24; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('');

// Test 1: Verificar localStorage
console.log('%c📦 TEST 1: Verificando localStorage...', 'color: #3B82F6; font-weight: bold;');
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const refreshToken = localStorage.getItem('refreshToken');

if (token) {
  console.log('✅ Token:', 'EXISTS');
  console.log('   Length:', token.length, 'characters');
} else {
  console.log('❌ Token:', 'MISSING');
}

if (user) {
  console.log('✅ User:', 'EXISTS');
  try {
    const userData = JSON.parse(user);
    console.log('   Email:', userData.email);
    console.log('   Role:', userData.role);
    console.log('   ID:', userData.id);
  } catch (e) {
    console.log('⚠️  User data corrupted:', e.message);
  }
} else {
  console.log('❌ User:', 'MISSING');
}

if (refreshToken) {
  console.log('✅ Refresh Token:', 'EXISTS');
} else {
  console.log('⚠️  Refresh Token:', 'MISSING (optional)');
}

console.log('');

// Test 2: Verificar que el header de API está configurado
console.log('%c🌐 TEST 2: Verificando configuración de API...', 'color: #3B82F6; font-weight: bold;');
// No podemos acceder directamente al axios config desde aquí, pero podemos intentar un fetch
console.log('ℹ️  Para verificar el header Authorization, revisa Network tab en DevTools');
console.log('');

// Test 3: Simular refresh y monitorear
console.log('%c🔄 TEST 3: Preparando monitoreo de refresh...', 'color: #3B82F6; font-weight: bold;');

// Monitorear cambios en storage
window.addEventListener('storage', (e) => {
  console.log('%c📝 Storage Change Detected:', 'color: #F59E0B;', {
    key: e.key,
    oldValue: e.oldValue ? e.oldValue.substring(0, 50) + '...' : null,
    newValue: e.newValue ? e.newValue.substring(0, 50) + '...' : null
  });
});

// Monitorear antes de cerrar/refresh
window.addEventListener('beforeunload', () => {
  console.log('%c⚠️  BEFORE UNLOAD - Estado actual:', 'color: #F59E0B; font-weight: bold;', {
    token: localStorage.getItem('token') ? 'EXISTS' : 'MISSING',
    user: localStorage.getItem('user') ? 'EXISTS' : 'MISSING',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Monitores configurados');
console.log('');

// Test 4: Resumen y recomendaciones
console.log('%c📊 RESUMEN Y PRÓXIMOS PASOS:', 'color: #10B981; font-weight: bold; font-size: 14px;');

const allGood = token && user;

if (allGood) {
  console.log('%c✅ TODO LISTO - Sesión debería persistir', 'color: #10B981; font-weight: bold;');
  console.log('');
  console.log('🔄 PRUEBA AHORA:');
  console.log('   1. Presiona F5 (o Cmd+R en Mac)');
  console.log('   2. Observa la consola al recargar');
  console.log('   3. Deberías ver: ✅ Usuario restaurado desde localStorage');
  console.log('   4. El Dashboard debe cargar SIN redirigir al login');
  console.log('');
  console.log('💡 TIP: Mantén esta consola abierta durante el refresh');
} else {
  console.log('%c⚠️  FALTAN DATOS - Necesitas hacer login primero', 'color: #F59E0B; font-weight: bold;');
  console.log('');
  console.log('📋 PASOS:');
  console.log('   1. Ejecuta: localStorage.clear(); location.reload();');
  console.log('   2. Haz login con: admin@maccomputadoras.com / demo123');
  console.log('   3. Ejecuta este script de nuevo');
  console.log('   4. Luego prueba el refresh');
}

console.log('');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280;');
console.log('');

// Exportar función de diagnóstico completo
window.testSessionPersistence = () => {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    localStorage: {
      token: !!localStorage.getItem('token'),
      user: !!localStorage.getItem('user'),
      refreshToken: !!localStorage.getItem('refreshToken'),
      darkMode: localStorage.getItem('darkMode')
    },
    userData: null,
    status: 'unknown'
  };

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      diagnosis.userData = JSON.parse(userStr);
    }
  } catch (e) {
    diagnosis.userData = { error: e.message };
  }

  diagnosis.status = (diagnosis.localStorage.token && diagnosis.localStorage.user) 
    ? 'READY' 
    : 'NOT_READY';

  console.log('%c📊 DIAGNÓSTICO COMPLETO:', 'background: #3B82F6; color: white; padding: 5px; font-weight: bold;');
  console.table(diagnosis.localStorage);
  console.log('User Data:', diagnosis.userData);
  console.log('Status:', diagnosis.status);
  
  return diagnosis;
};

console.log('💡 TIP: Ejecuta testSessionPersistence() en cualquier momento para ver el estado actual');

