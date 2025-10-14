#!/usr/bin/env node

/**
 * Script para desbloquear cuenta de admin bloqueada
 * Resetea login_attempts y locked_until
 * 
 * Uso: node unlock-admin.js
 */

import { User } from './src/models/index.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

(async () => {
  try {
    log('\n🔓 Desbloqueando cuentas de admin...', 'cyan');
    
    // Buscar todas las cuentas admin bloqueadas o con intentos
    const admins = await User.findAll({
      where: { role_id: 1 },
      attributes: ['id', 'email', 'username', 'login_attempts', 'locked_until']
    });

    if (admins.length === 0) {
      log('❌ No se encontraron cuentas de admin', 'red');
      process.exit(1);
    }

    log(`\n📋 Cuentas admin encontradas: ${admins.length}`, 'yellow');
    
    for (const admin of admins) {
      const wasLocked = admin.locked_until && new Date(admin.locked_until) > new Date();
      const hadAttempts = admin.login_attempts > 0;
      
      log(`\n👤 ${admin.email}`, 'cyan');
      log(`   Username: ${admin.username}`, 'yellow');
      log(`   Login attempts: ${admin.login_attempts}`, hadAttempts ? 'red' : 'green');
      log(`   Locked until: ${admin.locked_until || 'No bloqueado'}`, wasLocked ? 'red' : 'green');
      
      if (wasLocked || hadAttempts) {
        // Desbloquear
        await User.update(
          { 
            login_attempts: 0,
            locked_until: null 
          },
          { where: { id: admin.id } }
        );
        log(`   ✅ Desbloqueado exitosamente`, 'green');
      } else {
        log(`   ℹ️  No requiere desbloqueo`, 'green');
      }
    }

    log('\n🎉 Proceso completado!', 'green');
    log('\nAhora puedes ejecutar: node test-all-endpoints.js\n', 'cyan');
    
    process.exit(0);
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
})();

