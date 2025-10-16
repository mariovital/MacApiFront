// EJECUTA ESTO EN LA CONSOLA DESPUÉS DEL REFRESH

console.clear();
console.log('%c🔍 LOGS PERSISTENTES DESPUÉS DEL REFRESH', 'background: #E31E24; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('');

console.log('%c📦 localStorage:', 'color: #3B82F6; font-weight: bold;');
console.log('  token:', localStorage.getItem('token') ? '✅ EXISTS' : '❌ MISSING');
console.log('  user:', localStorage.getItem('user') ? '✅ EXISTS' : '❌ MISSING');
if (localStorage.getItem('user')) {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    console.log('  user.email:', u.email);
  } catch (e) {
    console.log('  user.email: ERROR', e.message);
  }
}
console.log('');

console.log('%c📊 sessionStorage (Logs de AuthContext):', 'color: #3B82F6; font-weight: bold;');
console.log('  auth_init_start:', sessionStorage.getItem('auth_init_start'));
console.log('  auth_has_token:', sessionStorage.getItem('auth_has_token'));
console.log('  auth_has_user:', sessionStorage.getItem('auth_has_user'));
console.log('  auth_header_set:', sessionStorage.getItem('auth_header_set'));
console.log('  auth_user_restored:', sessionStorage.getItem('auth_user_restored'));
console.log('  auth_user_email:', sessionStorage.getItem('auth_user_email'));
console.log('  auth_loading_set_false:', sessionStorage.getItem('auth_loading_set_false'));
console.log('  auth_profile_updated:', sessionStorage.getItem('auth_profile_updated'));
console.log('  auth_profile_error:', sessionStorage.getItem('auth_profile_error'));
console.log('  auth_error:', sessionStorage.getItem('auth_error'));
console.log('  auth_no_token:', sessionStorage.getItem('auth_no_token'));
console.log('  auth_init_complete:', sessionStorage.getItem('auth_init_complete'));
console.log('');

console.log('%c🌐 Estado actual:', 'color: #3B82F6; font-weight: bold;');
console.log('  URL:', window.location.pathname);
console.log('  En login?:', window.location.pathname === '/login' ? '❌ SÍ (problema)' : '✅ NO (correcto)');
console.log('');

// Análisis
const hasToken = localStorage.getItem('token');
const hasUser = localStorage.getItem('user');
const inLogin = window.location.pathname === '/login';
const userRestored = sessionStorage.getItem('auth_user_restored') === 'YES';

console.log('%c📋 DIAGNÓSTICO:', 'color: #10B981; font-weight: bold; font-size: 14px;');

if (hasToken && hasUser && userRestored && !inLogin) {
  console.log('%c✅ TODO CORRECTO - Sesión funcionando', 'color: #10B981; font-weight: bold;');
} else if (hasToken && hasUser && inLogin) {
  console.log('%c❌ PROBLEMA: Datos existen pero estás en /login', 'color: #EF4444; font-weight: bold;');
  console.log('Causa probable: AuthContext no restauró el usuario correctamente o ProtectedRoute redirigió antes de tiempo');
  console.log('');
  console.log('Verifica:');
  console.log('  • auth_user_restored:', sessionStorage.getItem('auth_user_restored'));
  console.log('  • auth_loading_set_false:', sessionStorage.getItem('auth_loading_set_false'));
} else if (!hasToken || !hasUser) {
  console.log('%c❌ PROBLEMA: localStorage perdió los datos', 'color: #EF4444; font-weight: bold;');
  console.log('Los datos se borraron durante el refresh (esto NO debería pasar)');
} else {
  console.log('%c⚠️  Situación inesperada', 'color: #F59E0B; font-weight: bold;');
}

console.log('');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6B7280;');

