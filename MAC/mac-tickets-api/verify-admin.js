#!/usr/bin/env node

import { User } from './src/models/index.js';
import bcrypt from 'bcrypt';

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
    log('\n🔍 Verificando usuarios admin...', 'cyan');
    
    const admins = await User.findAll({
      where: { role_id: 1 },
      attributes: ['id', 'email', 'username', 'password_hash', 'first_name', 'last_name']
    });

    if (admins.length === 0) {
      log('❌ No se encontraron cuentas de admin', 'red');
      process.exit(1);
    }

    log(`\n📋 Usuarios admin encontrados: ${admins.length}\n`, 'yellow');
    
    const testPasswords = ['admin123', 'demo123', 'password123', 'Admin123'];
    
    for (const admin of admins) {
      log(`👤 ${admin.first_name} ${admin.last_name}`, 'cyan');
      log(`   Email: ${admin.email}`, 'yellow');
      log(`   Username: ${admin.username}`, 'yellow');
      log(`   Hash: ${admin.password_hash.substring(0, 30)}...`, 'yellow');
      
      log(`   Testing passwords:`, 'cyan');
      for (const pwd of testPasswords) {
        const isValid = await bcrypt.compare(pwd, admin.password_hash);
        if (isValid) {
          log(`      ✅ "${pwd}" - VÁLIDA`, 'green');
        } else {
          log(`      ❌ "${pwd}" - INVÁLIDA`, 'red');
        }
      }
      log('');
    }

    log('💡 Usa las credenciales válidas en test-all-endpoints.js\n', 'cyan');
    
    process.exit(0);
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
})();

