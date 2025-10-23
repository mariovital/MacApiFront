package mx.tec.prototipo_01

import android.app.Application
import android.util.Log
import com.google.android.gms.maps.MapsInitializer

class MacApp : Application() {
    override fun onCreate() {
        super.onCreate()
        try {
            // Precalienta el SDK de Maps para reducir trabajo en el primer render
            MapsInitializer.initialize(
                applicationContext,
                MapsInitializer.Renderer.LATEST
            ) { renderer ->
                Log.d("MapsInit", "Renderer: $renderer")
            }
        } catch (t: Throwable) {
            Log.w("MapsInit", "No se pudo inicializar Maps anticipadamente", t)
        }
    }
}
