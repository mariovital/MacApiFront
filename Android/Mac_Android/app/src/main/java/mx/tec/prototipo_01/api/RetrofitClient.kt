package mx.tec.prototipo_01.api

import android.util.Log
import mx.tec.prototipo_01.BuildConfig
import mx.tec.prototipo_01.auth.TokenStore
import mx.tec.prototipo_01.config.ApiConfig
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import okhttp3.Dns
import java.net.InetAddress
import java.net.UnknownHostException

/**
 * Objeto singleton que configura y proporciona una instancia de Retrofit.
 * 
 * NOTA: Para cambiar entre emulador/dispositivo físico/producción,
 * edita el archivo ApiConfig.kt
 */
object RetrofitClient {

    // Interceptor para agregar Authorization: Bearer <token>
    private val authInterceptor = object : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val original = chain.request()
            val token = TokenStore.token
            val request = if (!token.isNullOrBlank()) {
                original.newBuilder()
                    .addHeader("Authorization", "Bearer $token")
                    .build()
            } else original
            return chain.proceed(request)
        }
    }

    private val httpClient by lazy {
        val loggingInterceptor = object : Interceptor {
            override fun intercept(chain: Interceptor.Chain): Response {
                val request = chain.request()
                Log.d("Api", "Request: ${request.method} ${request.url}")
                return chain.proceed(request)
            }
        }
        // DNS fallback: si el dispositivo no resuelve el host, usar IP alternativa si está configurada
        val dnsFallback: Dns = object : Dns {
            override fun lookup(hostname: String): List<InetAddress> {
                return try {
                    Dns.SYSTEM.lookup(hostname)
                } catch (e: UnknownHostException) {
                    val fallbackIp = BuildConfig.API_HOST_FALLBACK_IP
                    if (!fallbackIp.isNullOrBlank()) {
                        Log.w("Api", "DNS fallo para $hostname, usando fallback IP $fallbackIp")
                        listOf(InetAddress.getByName(fallbackIp))
                    } else {
                        throw e
                    }
                }
            }
        }
        OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .addInterceptor(authInterceptor)
            .dns(dnsFallback)
            .connectTimeout(ApiConfig.CONNECT_TIMEOUT, TimeUnit.SECONDS)
            .readTimeout(ApiConfig.READ_TIMEOUT, TimeUnit.SECONDS)
            .writeTimeout(ApiConfig.WRITE_TIMEOUT, TimeUnit.SECONDS)
            .build()
    }

    // Creación de la instancia de Retrofit
    private val retrofit by lazy {
        val rawBaseUrl = if (!BuildConfig.API_BASE_URL.isNullOrBlank()) BuildConfig.API_BASE_URL else ApiConfig.BASE_URL
        val baseUrl = normalizeBaseUrl(rawBaseUrl)
        Log.i("Api", "Base URL (raw): $rawBaseUrl, (normalized): $baseUrl, override=${BuildConfig.API_BASE_URL.isNotBlank()}")
        Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    private fun normalizeBaseUrl(url: String): String {
        var u = url.trim()
        if (!u.endsWith("/")) u += "/"
        val lower = u.lowercase()
        val isAwsGateway = lower.contains("execute-api")
        val isElasticBeanstalk = lower.contains("elasticbeanstalk.com")
        val missingApi = !lower.contains("/api/")
        val endsWithStage = lower.matches(Regex(".*/(prod|dev|stage)/"))
        // Para API Gateway: si termina en /{stage}/ y falta /api/, añadimos /api/
        if (isAwsGateway && missingApi && endsWithStage) {
            u += "api/"
        }
        // Para Elastic Beanstalk: siempre requiere prefijo /api
        if (isElasticBeanstalk && missingApi) {
            u += "api/"
        }
        return u
    }

    // Un "lazy delegate" para crear la instancia del servicio solo cuando se necesite
    val instance: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}
