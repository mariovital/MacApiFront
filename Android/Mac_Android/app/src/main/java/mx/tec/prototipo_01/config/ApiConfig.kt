package mx.tec.prototipo_01.config

/**
 * Configuración de URLs del API según el entorno
 * 
 * PARA DESARROLLO:
 * - Emulador Android Studio: usa 10.0.2.2 (alias para localhost del host)
 * - Dispositivo físico: usa la IP local de tu computadora (ej: 192.168.1.100)
 * 
 * PARA PRODUCCIÓN:
 * - Cambiar a la URL del servidor en AWS o el dominio final
 */
object ApiConfig {
    
    // ====== CONFIGURACIÓN DE AMBIENTE ======
    // Cambia esto según dónde estés ejecutando la app
    enum class Environment {
        EMULATOR,           // Emulador Android Studio
        PHYSICAL_DEVICE,    // Dispositivo físico en la misma red
        PRODUCTION          // Servidor en producción (AWS)
    }
    
    // ===== CAMBIAR AQUÍ SEGÚN TU ENTORNO =====
    private val CURRENT_ENVIRONMENT = Environment.EMULATOR
    
    // ====== URLs POR AMBIENTE ======
    private const val EMULATOR_BASE_URL = "http://10.0.2.2:3001/api/"
    
    // IMPORTANTE: Cambiar esta IP por la IP local de tu computadora
    // Para encontrarla:
    // - Windows: ipconfig (busca IPv4)
    // - Mac/Linux: ifconfig (busca inet)
    private const val PHYSICAL_DEVICE_BASE_URL = "http://192.168.1.100:3001/api/"
    
    // URL del servidor en producción (AWS o dominio)
    // Ejemplo de API Gateway: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/api/
    // Reemplaza con tu URL de API Gateway (Docs/AWS-RUTAS-API-GATEWAY.txt)
    private const val PRODUCTION_BASE_URL = "https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/api/"
    
    // ====== URL ACTUAL ======
    // Nota: Si BuildConfig.API_BASE_URL está configurado (app/build.gradle.kts), RetrofitClient lo usará en lugar de esta constante.
    val BASE_URL: String
        get() = when (CURRENT_ENVIRONMENT) {
            Environment.EMULATOR -> EMULATOR_BASE_URL
            Environment.PHYSICAL_DEVICE -> PHYSICAL_DEVICE_BASE_URL
            Environment.PRODUCTION -> PRODUCTION_BASE_URL
        }
    
    // ====== CONFIGURACIÓN ADICIONAL ======
    const val CONNECT_TIMEOUT = 15L // segundos
    const val READ_TIMEOUT = 20L    // segundos
    const val WRITE_TIMEOUT = 20L   // segundos
    
    // Información del ambiente actual
    fun getEnvironmentInfo(): String {
        return """
            Ambiente: ${CURRENT_ENVIRONMENT.name}
            Base URL: $BASE_URL
            Timeout: $CONNECT_TIMEOUT segundos
            Override (BuildConfig.API_BASE_URL): configurable en local.properties (API_BASE_URL)
        """.trimIndent()
    }
}

