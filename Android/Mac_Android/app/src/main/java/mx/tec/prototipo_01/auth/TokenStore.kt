package mx.tec.prototipo_01.auth

import androidx.annotation.MainThread

/**
 * TokenStore simple en memoria. Para persistencia real, usar DataStore Preferences.
 */
object TokenStore {
    @Volatile
    var token: String? = null
        private set

    @Volatile
    var refreshToken: String? = null
        private set

    @MainThread
    fun save(token: String?, refresh: String?) {
        this.token = token
        this.refreshToken = refresh
    }

    @MainThread
    fun clear() {
        token = null
        refreshToken = null
    }
}
