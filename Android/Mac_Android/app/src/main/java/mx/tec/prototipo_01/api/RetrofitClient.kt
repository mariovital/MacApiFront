package mx.tec.prototipo_01.api

import mx.tec.prototipo_01.auth.TokenStore
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Objeto singleton que configura y proporciona una instancia de Retrofit.
 */
object RetrofitClient {

    // Para Emulador Android Studio (puente a localhost del host)
    private const val BASE_URL = "mactickets-db.clcbz19idjuk.us-east-1.rds.amazonaws.com"

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
        OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .build()
    }

    // Creación de la instancia de Retrofit
    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    // Un "lazy delegate" para crear la instancia del servicio solo cuando se necesite
    val instance: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}
