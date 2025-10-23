import java.util.Properties
import java.io.FileInputStream
import java.io.File

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

// Helper to resolve a property from root local.properties, module local.properties, env var, or Gradle -P
fun resolveSecret(key: String): String? {
    fun fromFile(file: File): String? {
        return try {
            if (!file.exists()) {
                null
            } else {
                val p = Properties()
                FileInputStream(file).use { p.load(it) }
                p.getProperty(key)?.takeIf { it.isNotBlank() }
            }
        } catch (_: Exception) {
            null
        }
    }

    // 1) rootProject/local.properties
    fromFile(rootProject.file("local.properties"))?.let { return it }
    // 2) module/app/local.properties
    fromFile(project.file("local.properties"))?.let { return it }
    // 3) environment variable
    System.getenv(key)?.takeIf { it.isNotBlank() }?.let { return it }
    // 4) gradle -P
    return (project.findProperty(key) as String?)?.takeIf { it.isNotBlank() }
}

android {
    namespace = "mx.tec.prototipo_01"
    compileSdk = 36

    defaultConfig {
        applicationId = "mx.tec.prototipo_01"
        minSdk = 27
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // Make the API key available as a manifest placeholder
        val mapsApiKey = resolveSecret("MAPS_API_KEY") ?: ""
        manifestPlaceholders["MAPS_API_KEY"] = mapsApiKey
    // Also expose the key to code via BuildConfig for fallback geocoding
    buildConfigField("String", "MAPS_API_KEY", "\"${mapsApiKey}\"")
        if (mapsApiKey.isBlank()) {
            println("WARNING: MAPS_API_KEY is empty. Google Maps tiles will not render. Set it in Android/Mac_Android/local.properties or app/local.properties or as env var MAPS_API_KEY.")
        }

        // API base URL override (for AWS API Gateway). If set, the app usará este valor directamente.
        val apiBaseUrl = resolveSecret("API_BASE_URL") ?: ""
        buildConfigField("String", "API_BASE_URL", "\"${apiBaseUrl}\"")
        if (apiBaseUrl.isNotBlank()) {
            println("INFO: Using API_BASE_URL override: $apiBaseUrl")
        }

        // Optional fallback IP for the API host to bypass device DNS issues
        val apiHostFallbackIp = resolveSecret("API_HOST_FALLBACK_IP") ?: ""
        buildConfigField("String", "API_HOST_FALLBACK_IP", "\"${apiHostFallbackIp}\"")
        if (apiHostFallbackIp.isNotBlank()) {
            println("INFO: Using API_HOST_FALLBACK_IP: $apiHostFallbackIp")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    // Ensure BuildConfig is generated so we can reference BuildConfig.MAPS_API_KEY
    buildConfig = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation("androidx.navigation:navigation-compose:2.8.0-beta05")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.4")
    // Material Icons Extended (para íconos como AttachFile)
    implementation("androidx.compose.material:material-icons-extended")

    // Retrofit for networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    // OkHttp 4 para extensiones Kotlin (asRequestBody, toMediaTypeOrNull)
    implementation("com.squareup.okhttp3:okhttp:4.11.0")

    // Google Maps for Compose
    implementation("com.google.maps.android:maps-compose:4.3.3")
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    implementation("com.google.android.libraries.places:places:3.4.0")

    // Coil para carga de imágenes y miniaturas en Compose
    implementation("io.coil-kt:coil-compose:2.6.0")

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}