#!/usr/bin/env node

/**
 * Script de Testing Automatizado para MAC Tickets API
 * 
 * Prueba TODOS los endpoints del sistema de manera secuencial
 * 
 * Uso:
 *   node test-all-endpoints.js
 *   node test-all-endpoints.js --url=http://localhost:3001
 *   node test-all-endpoints.js --verbose
 */

const API_URL = process.argv.find(arg => arg.startsWith('--url='))?.split('=')[1] || 'http://localhost:3001';
const VERBOSE = process.argv.includes('--verbose');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Estado global del test
let authToken = '';
let refreshToken = '';
let testUserId = null;
let testTicketId = null;
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Credenciales de prueba
const TEST_CREDENTIALS = {
  email: 'admin@maccomputadoras.com',
  password: 'demo123'
};

// Helper: Log con color
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper: Log de sección
function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(`  ${title}`, 'cyan');
  console.log('='.repeat(70));
}

// Helper: Log de test
function logTest(method, endpoint, status) {
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  log(`${statusIcon} [${method.padEnd(6)}] ${endpoint}`, statusColor);
}

// Helper: Hacer request
async function makeRequest(method, endpoint, body = null, useAuth = false) {
  totalTests++;
  const url = `${API_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (useAuth && authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    const success = response.ok;
    if (success) {
      passedTests++;
    } else {
      failedTests++;
    }

    if (VERBOSE) {
      log(`  Response Status: ${response.status}`, success ? 'green' : 'red');
      log(`  Response Data: ${JSON.stringify(data, null, 2).substring(0, 200)}...`, 'white');
    }

    return {
      success,
      status: response.status,
      data
    };
  } catch (error) {
    failedTests++;
    if (VERBOSE) {
      log(`  Error: ${error.message}`, 'red');
    }
    return {
      success: false,
      status: 0,
      error: error.message
    };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  logSection('1. HEALTH CHECK');
  
  const result = await makeRequest('GET', '/health');
  logTest('GET', '/health', result.success ? 'PASS' : 'FAIL');
  
  return result.success;
}

// Test 2: Authentication
async function testAuthentication() {
  logSection('2. AUTHENTICATION');

  // 2.1 Login
  log('\n2.1 Login', 'yellow');
  const loginResult = await makeRequest('POST', '/api/auth/login', TEST_CREDENTIALS);
  logTest('POST', '/api/auth/login', loginResult.success ? 'PASS' : 'FAIL');
  
  if (loginResult.success && loginResult.data.data) {
    authToken = loginResult.data.data.token;
    refreshToken = loginResult.data.data.refreshToken;
    log(`  Token obtenido: ${authToken.substring(0, 20)}...`, 'green');
  }

  // 2.2 Get Profile
  log('\n2.2 Get Profile', 'yellow');
  const profileResult = await makeRequest('GET', '/api/auth/profile', null, true);
  logTest('GET', '/api/auth/profile', profileResult.success ? 'PASS' : 'FAIL');
  
  if (profileResult.success && profileResult.data.data) {
    testUserId = profileResult.data.data.id;
    log(`  User ID: ${testUserId}`, 'green');
    log(`  User: ${profileResult.data.data.first_name} ${profileResult.data.data.last_name}`, 'green');
  }

  // 2.3 Logout
  log('\n2.3 Logout', 'yellow');
  const logoutResult = await makeRequest('POST', '/api/auth/logout', null, true);
  logTest('POST', '/api/auth/logout', logoutResult.success ? 'PASS' : 'FAIL');

  // Re-login para continuar tests
  log('\n2.4 Re-login para continuar tests', 'yellow');
  const reloginResult = await makeRequest('POST', '/api/auth/login', TEST_CREDENTIALS);
  if (reloginResult.success && reloginResult.data.data) {
    authToken = reloginResult.data.data.token;
    log(`  Re-autenticado exitosamente`, 'green');
  }
}

// Test 3: Catalogs
async function testCatalogs() {
  logSection('3. CATALOGS');

  // 3.1 Categories
  log('\n3.1 Categories', 'yellow');
  const categoriesResult = await makeRequest('GET', '/api/catalog/categories', null, true);
  logTest('GET', '/api/catalog/categories', categoriesResult.success ? 'PASS' : 'FAIL');
  if (categoriesResult.success && categoriesResult.data.data) {
    log(`  Total categorías: ${categoriesResult.data.data.length}`, 'green');
  }

  // 3.2 Priorities
  log('\n3.2 Priorities', 'yellow');
  const prioritiesResult = await makeRequest('GET', '/api/catalog/priorities', null, true);
  logTest('GET', '/api/catalog/priorities', prioritiesResult.success ? 'PASS' : 'FAIL');
  if (prioritiesResult.success && prioritiesResult.data.data) {
    log(`  Total prioridades: ${prioritiesResult.data.data.length}`, 'green');
  }

  // 3.3 Ticket Statuses
  log('\n3.3 Ticket Statuses', 'yellow');
  const statusesResult = await makeRequest('GET', '/api/catalog/ticket-statuses', null, true);
  logTest('GET', '/api/catalog/ticket-statuses', statusesResult.success ? 'PASS' : 'FAIL');
  if (statusesResult.success && statusesResult.data.data) {
    log(`  Total estados: ${statusesResult.data.data.length}`, 'green');
  }

  // 3.4 Technicians
  log('\n3.4 Technicians', 'yellow');
  const techsResult = await makeRequest('GET', '/api/catalog/technicians', null, true);
  logTest('GET', '/api/catalog/technicians', techsResult.success ? 'PASS' : 'FAIL');
  if (techsResult.success && techsResult.data.data) {
    log(`  Total técnicos: ${techsResult.data.data.length}`, 'green');
  }
}

// Test 4: Tickets
async function testTickets() {
  logSection('4. TICKETS');

  // 4.1 Get All Tickets
  log('\n4.1 Get All Tickets', 'yellow');
  const ticketsResult = await makeRequest('GET', '/api/tickets', null, true);
  logTest('GET', '/api/tickets', ticketsResult.success ? 'PASS' : 'FAIL');
  
  if (ticketsResult.success && ticketsResult.data.data) {
    const items = ticketsResult.data.data.items || [];
    log(`  Total tickets: ${ticketsResult.data.data.pagination?.total || items.length}`, 'green');
    
    // Guardar un ticket ID para tests posteriores
    if (items.length > 0) {
      testTicketId = items[0].id;
      log(`  Test Ticket ID: ${testTicketId}`, 'green');
    }
  }

  // 4.2 Get Ticket Stats
  log('\n4.2 Get Ticket Stats', 'yellow');
  const statsResult = await makeRequest('GET', '/api/tickets/stats', null, true);
  logTest('GET', '/api/tickets/stats', statsResult.success ? 'PASS' : 'FAIL');
  if (statsResult.success && statsResult.data.data) {
    log(`  Stats: ${JSON.stringify(statsResult.data.data)}`, 'green');
  }

  // 4.3 Create Ticket
  log('\n4.3 Create Ticket', 'yellow');
  const newTicketData = {
    title: 'Test Ticket - Automated Testing',
    description: 'Este ticket fue creado automáticamente por el script de testing',
    category_id: 1,
    priority_id: 2,
    client_company: 'Empresa Test',
    client_contact: 'Contacto Test',
    client_email: 'test@empresa.com',
    location: 'Ubicación de prueba'
  };
  const createResult = await makeRequest('POST', '/api/tickets', newTicketData, true);
  logTest('POST', '/api/tickets', createResult.success ? 'PASS' : 'FAIL');
  
  let createdTicketId = null;
  if (createResult.success && createResult.data.data) {
    createdTicketId = createResult.data.data.id;
    log(`  Ticket creado: ID ${createdTicketId}`, 'green');
    log(`  Ticket Number: ${createResult.data.data.ticket_number}`, 'green');
  }

  // 4.4 Get Single Ticket
  if (testTicketId) {
    log('\n4.4 Get Single Ticket', 'yellow');
    const singleResult = await makeRequest('GET', `/api/tickets/${testTicketId}`, null, true);
    logTest('GET', `/api/tickets/${testTicketId}`, singleResult.success ? 'PASS' : 'FAIL');
    if (singleResult.success && singleResult.data.data) {
      log(`  Ticket: ${singleResult.data.data.title}`, 'green');
    }
  }

  // 4.5 Update Ticket
  if (createdTicketId) {
    log('\n4.5 Update Ticket', 'yellow');
    const updateData = {
      title: 'Test Ticket - UDATED',
      description: 'Ticket actualizado por el script de testing'
    };
    const updateResult = await makeRequest('PUT', `/api/tickets/${createdTicketId}`, updateData, true);
    logTest('PUT', `/api/tickets/${createdTicketId}`, updateResult.success ? 'PASS' : 'FAIL');
  }

  // 4.6 Assign Ticket
  if (createdTicketId) {
    log('\n4.6 Assign Ticket', 'yellow');
    const assignData = {
      technician_id: 3, // ID de un técnico válido (Juan Pérez)
      reason: 'Asignación automática para testing'
    };
    const assignResult = await makeRequest('POST', `/api/tickets/${createdTicketId}/assign`, assignData, true);
    logTest('POST', `/api/tickets/${createdTicketId}/assign`, assignResult.success ? 'PASS' : 'FAIL');
  }

  // 4.7 Update Ticket Status
  if (createdTicketId) {
    log('\n4.7 Update Ticket Status', 'yellow');
    const statusData = {
      status_id: 3, // En Proceso
      reason: 'Cambio de estado para testing'
    };
    const statusResult = await makeRequest('PATCH', `/api/tickets/${createdTicketId}/status`, statusData, true);
    logTest('PATCH', `/api/tickets/${createdTicketId}/status`, statusResult.success ? 'PASS' : 'FAIL');
  }
}

// Test 5: Users (si tienes permisos de admin)
async function testUsers() {
  logSection('5. USERS (Admin only)');

  // 5.1 Get All Users
  log('\n5.1 Get All Users', 'yellow');
  const usersResult = await makeRequest('GET', '/api/users', null, true);
  logTest('GET', '/api/users', usersResult.success ? 'PASS' : 'FAIL');
  if (usersResult.success && usersResult.data.data) {
    log(`  Total usuarios: ${usersResult.data.data.length || 0}`, 'green');
  }

  // 5.2 Get Single User
  if (testUserId) {
    log('\n5.2 Get Single User', 'yellow');
    const userResult = await makeRequest('GET', `/api/users/${testUserId}`, null, true);
    logTest('GET', `/api/users/${testUserId}`, userResult.success ? 'PASS' : 'FAIL');
  }
}

// Test 6: Filters and Pagination
async function testFilters() {
  logSection('6. FILTERS AND PAGINATION');

  // 6.1 Filter by status
  log('\n6.1 Filter by Status', 'yellow');
  const filterResult1 = await makeRequest('GET', '/api/tickets?status=1', null, true);
  logTest('GET', '/api/tickets?status=1', filterResult1.success ? 'PASS' : 'FAIL');

  // 6.2 Filter by priority
  log('\n6.2 Filter by Priority', 'yellow');
  const filterResult2 = await makeRequest('GET', '/api/tickets?priority=2', null, true);
  logTest('GET', '/api/tickets?priority=2', filterResult2.success ? 'PASS' : 'FAIL');

  // 6.3 Pagination
  log('\n6.3 Pagination', 'yellow');
  const paginationResult = await makeRequest('GET', '/api/tickets?page=1&limit=5', null, true);
  logTest('GET', '/api/tickets?page=1&limit=5', paginationResult.success ? 'PASS' : 'FAIL');
  if (paginationResult.success && paginationResult.data.data) {
    const items = paginationResult.data.data.items || [];
    log(`  Items en página: ${items.length}`, 'green');
  }

  // 6.4 Search
  log('\n6.4 Search', 'yellow');
  const searchResult = await makeRequest('GET', '/api/tickets?search=test', null, true);
  logTest('GET', '/api/tickets?search=test', searchResult.success ? 'PASS' : 'FAIL');
}

// Test 7: Error Handling
async function testErrorHandling() {
  logSection('7. ERROR HANDLING');

  // 7.1 Invalid Endpoint
  log('\n7.1 Invalid Endpoint (404)', 'yellow');
  const notFoundResult = await makeRequest('GET', '/api/invalid-endpoint', null, true);
  logTest('GET', '/api/invalid-endpoint', notFoundResult.status === 404 ? 'PASS' : 'FAIL');

  // 7.2 Unauthorized (no token)
  log('\n7.2 Unauthorized (401)', 'yellow');
  const tempToken = authToken;
  authToken = ''; // Quitar token temporalmente
  const unauthorizedResult = await makeRequest('GET', '/api/tickets', null, true);
  logTest('GET', '/api/tickets (no auth)', unauthorizedResult.status === 401 ? 'PASS' : 'FAIL');
  authToken = tempToken; // Restaurar token

  // 7.3 Invalid Login
  log('\n7.3 Invalid Login (401)', 'yellow');
  const invalidLoginResult = await makeRequest('POST', '/api/auth/login', {
    email: 'invalid@email.com',
    password: 'wrongpassword'
  });
  logTest('POST', '/api/auth/login (invalid)', invalidLoginResult.status === 401 ? 'PASS' : 'FAIL');

  // 7.4 Invalid Ticket ID
  log('\n7.4 Invalid Ticket ID (404)', 'yellow');
  const invalidIdResult = await makeRequest('GET', '/api/tickets/999999', null, true);
  logTest('GET', '/api/tickets/999999', invalidIdResult.status === 404 ? 'PASS' : 'FAIL');
}

// Función principal
async function runAllTests() {
  const startTime = Date.now();
  
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     MAC TICKETS API - TEST AUTOMATIZADO DE ENDPOINTS             ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════════╝', 'cyan');
  log(`\nAPI URL: ${API_URL}`, 'yellow');
  log(`Modo: ${VERBOSE ? 'Verbose' : 'Normal'}`, 'yellow');
  log(`Iniciando tests: ${new Date().toLocaleString()}`, 'yellow');

  try {
    // Ejecutar todos los tests
    await testHealthCheck();
    await testAuthentication();
    await testCatalogs();
    await testTickets();
    await testUsers();
    await testFilters();
    await testErrorHandling();

  } catch (error) {
    log(`\n❌ Error crítico: ${error.message}`, 'red');
    if (VERBOSE) {
      console.error(error);
    }
  }

  // Resumen final
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  logSection('RESUMEN FINAL');
  log(`\n📊 Estadísticas:`, 'cyan');
  log(`   Total de tests: ${totalTests}`, 'white');
  log(`   ✅ Pasados: ${passedTests}`, 'green');
  log(`   ❌ Fallidos: ${failedTests}`, 'red');
  log(`   ⏱️  Duración: ${duration}s`, 'yellow');
  log(`   📈 Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`, 'cyan');

  if (failedTests === 0) {
    log(`\n🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!`, 'green');
  } else {
    log(`\n⚠️  Algunos tests fallaron. Revisa los logs arriba.`, 'yellow');
  }

  log(`\nFinalizado: ${new Date().toLocaleString()}`, 'yellow');
  log('\n' + '='.repeat(70) + '\n', 'cyan');

  // Exit code basado en resultados
  process.exit(failedTests > 0 ? 1 : 0);
}

// Ejecutar
runAllTests();
