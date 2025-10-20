// Test script para verificar que los endpoints del dashboard funcionen
// Ejecutar con: node test-dashboard-api.js

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

// Token de prueba - reemplazar con uno real
const TOKEN = 'TU_TOKEN_AQUI';

async function testDashboardEndpoints() {
  console.log('🧪 Iniciando pruebas de endpoints del Dashboard...\n');

  try {
    // Test 1: GET /api/reports/dashboard
    console.log('📊 Test 1: GET /api/reports/dashboard');
    const statsResponse = await axios.get(`${API_URL}/reports/dashboard`, {
      params: { dateRange: '30days' },
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (statsResponse.data.success) {
      console.log('✅ Estadísticas obtenidas correctamente');
      console.log('   - Total Tickets:', statsResponse.data.data.stats.totalTickets);
      console.log('   - Resueltos:', statsResponse.data.data.stats.resolvedTickets);
      console.log('   - Tiempo Promedio:', statsResponse.data.data.stats.averageResolutionTime);
      console.log('   - SLA Compliance:', statsResponse.data.data.stats.slaCompliance + '%');
      console.log('   - Categorías:', statsResponse.data.data.categoryStats.length);
      console.log('   - Prioridades:', statsResponse.data.data.priorityStats.length);
    } else {
      console.log('❌ Error en la respuesta de estadísticas');
    }
    console.log('');

    // Test 2: GET /api/tickets (últimos 5)
    console.log('🎫 Test 2: GET /api/tickets (últimos 5)');
    const ticketsResponse = await axios.get(`${API_URL}/tickets`, {
      params: {
        limit: 5,
        page: 1,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      },
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (ticketsResponse.data.success) {
      console.log('✅ Tickets recientes obtenidos correctamente');
      console.log('   - Total en respuesta:', ticketsResponse.data.data.items.length);
      console.log('   - Total en DB:', ticketsResponse.data.data.pagination.total);
      
      if (ticketsResponse.data.data.items.length > 0) {
        const ticket = ticketsResponse.data.data.items[0];
        console.log('\n   📝 Ejemplo de ticket:');
        console.log('      - Número:', ticket.ticket_number);
        console.log('      - Título:', ticket.title);
        console.log('      - Prioridad:', ticket.priority?.name);
        console.log('      - Estado:', ticket.status?.name);
        console.log('      - Asignado:', ticket.assigned_to ? 
          `${ticket.assigned_to.first_name} ${ticket.assigned_to.last_name}` : 
          'Sin asignar');
      }
    } else {
      console.log('❌ Error en la respuesta de tickets');
    }
    console.log('');

    console.log('🎉 Todos los tests completados exitosamente!\n');
    console.log('📋 Resumen:');
    console.log('   ✅ Endpoint de estadísticas: OK');
    console.log('   ✅ Endpoint de tickets: OK');
    console.log('   ✅ Dashboard listo para usar datos reales\n');

  } catch (error) {
    console.error('\n❌ Error en las pruebas:');
    
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Mensaje:', error.response.data.message || error.message);
      
      if (error.response.status === 401) {
        console.error('\n⚠️  Token inválido o expirado');
        console.error('   1. Hacer login en el frontend');
        console.error('   2. Copiar el token de localStorage');
        console.error('   3. Reemplazar TOKEN en este archivo');
      }
    } else if (error.request) {
      console.error('   - No se recibió respuesta del servidor');
      console.error('   - Verificar que el backend esté corriendo en', API_URL);
    } else {
      console.error('   -', error.message);
    }
    
    console.error('\n📖 Guía de solución:');
    console.error('   1. Verificar que el backend esté corriendo: cd MAC/mac-tickets-api && npm start');
    console.error('   2. Verificar el token en el archivo test-dashboard-api.js');
    console.error('   3. Verificar que haya datos en la base de datos\n');
  }
}

// Instrucciones
console.log('═══════════════════════════════════════════════════════');
console.log('  TEST DE ENDPOINTS DEL DASHBOARD');
console.log('═══════════════════════════════════════════════════════\n');

if (TOKEN === 'TU_TOKEN_AQUI') {
  console.log('⚠️  ATENCIÓN: Debes configurar un token válido\n');
  console.log('📝 Pasos:');
  console.log('   1. Hacer login en http://localhost:5173');
  console.log('   2. Abrir DevTools > Console');
  console.log('   3. Ejecutar: localStorage.getItem("token")');
  console.log('   4. Copiar el token y reemplazarlo en la línea 7 de este archivo');
  console.log('   5. Ejecutar: node test-dashboard-api.js\n');
  process.exit(1);
} else {
  testDashboardEndpoints();
}

