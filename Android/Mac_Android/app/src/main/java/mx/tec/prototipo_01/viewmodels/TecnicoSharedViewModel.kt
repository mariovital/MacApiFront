package mx.tec.prototipo_01.viewmodels

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import mx.tec.prototipo_01.api.RetrofitClient
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.models.TicketStatus
import mx.tec.prototipo_01.models.toDomain

sealed interface TicketsUiState {
    data class Success(val tickets: List<TecnicoTicket>) : TicketsUiState
    object Error : TicketsUiState
    object Loading : TicketsUiState
}

class TecnicoSharedViewModel : ViewModel() {

    var pendingTicketsState: TicketsUiState by mutableStateOf(TicketsUiState.Loading)
        private set

    var historyTicketsState: TicketsUiState by mutableStateOf(TicketsUiState.Loading)
        private set

    init {
        loadTickets()
    }

    fun loadTickets() {
        viewModelScope.launch {
            pendingTicketsState = TicketsUiState.Loading
            historyTicketsState = TicketsUiState.Loading
            try {
                // El backend filtra por rol automáticamente en GET /tickets
                val response = RetrofitClient.instance.getTickets(limit = 200)
                if (response.isSuccessful) {
                    val apiItems = response.body()?.data?.items.orEmpty()
                    
                    // Actualizar el mapa de IDs
                    ticketIdMap.clear()
                    apiItems.forEach { ticketIdMap[it.ticket_number] = it.id }
                    
                    val allTickets = apiItems.map { it.toDomain() }
                    val (pending, history) = allTickets.partition { t ->
                        t.status == TicketStatus.PENDIENTE || t.status == TicketStatus.EN_PROCESO
                    }
                    pendingTicketsState = TicketsUiState.Success(pending)
                    historyTicketsState = TicketsUiState.Success(history)
                } else {
                    Log.e("TecnicoSharedViewModel", "Error loading tickets: ${response.message()}")
                    pendingTicketsState = TicketsUiState.Error
                    historyTicketsState = TicketsUiState.Error
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Exception loading tickets", e)
                pendingTicketsState = TicketsUiState.Error
                historyTicketsState = TicketsUiState.Error
            }
        }
    }

    // Mapa ticket_number -> backend id
    private val ticketIdMap = mutableMapOf<String, Int>()

    fun getTicketById(id: String): TecnicoTicket? {
        val pending = (pendingTicketsState as? TicketsUiState.Success)?.tickets ?: emptyList()
        val history = (historyTicketsState as? TicketsUiState.Success)?.tickets ?: emptyList()
        return (pending + history).find { it.id == id }
    }

    fun refreshTicketDetail(ticketNumber: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketNumber] ?: return@launch
                val response = RetrofitClient.instance.getTicketById(backendId)
                if (response.isSuccessful) {
                    val apiItem = response.body()?.data ?: return@launch
                    val updated = apiItem.toDomain()
                    
                    // Actualizar en la lista correspondiente
                    val pending = (pendingTicketsState as? TicketsUiState.Success)?.tickets?.toMutableList() ?: mutableListOf()
                    val history = (historyTicketsState as? TicketsUiState.Success)?.tickets?.toMutableList() ?: mutableListOf()
                    
                    val idxPending = pending.indexOfFirst { it.id == ticketNumber }
                    if (idxPending >= 0) {
                        pending[idxPending] = updated
                        pendingTicketsState = TicketsUiState.Success(pending)
                        return@launch
                    }
                    
                    val idxHistory = history.indexOfFirst { it.id == ticketNumber }
                    if (idxHistory >= 0) {
                        history[idxHistory] = updated
                        historyTicketsState = TicketsUiState.Success(history)
                    }
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Error refreshing ticket detail", e)
            }
        }
    }

    fun acceptTicket(ticketId: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                val response = RetrofitClient.instance.acceptTicket(backendId)
                if (response.isSuccessful) {
                    Log.d("TecnicoSharedViewModel", "Ticket aceptado exitosamente")
                    // Recargar tickets para reflejar el cambio
                    loadTickets()
                } else {
                    Log.e("TecnicoSharedViewModel", "Error al aceptar ticket: ${response.message()}")
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Exception al aceptar ticket", e)
            }
        }
    }

    fun rejectTicket(ticketId: String, reason: String?) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                val response = RetrofitClient.instance.rejectTicket(
                    backendId,
                    mx.tec.prototipo_01.models.api.RejectTicketRequest(reason = reason)
                )
                if (response.isSuccessful) {
                    Log.d("TecnicoSharedViewModel", "Ticket rechazado exitosamente")
                    // Recargar tickets para reflejar el cambio
                    loadTickets()
                } else {
                    Log.e("TecnicoSharedViewModel", "Error al rechazar ticket: ${response.message()}")
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Exception al rechazar ticket", e)
            }
        }
    }

    fun closeTicket(ticketId: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                // Marcar ticket como resuelto con comentario obligatorio
                val response = RetrofitClient.instance.resolveTicket(
                    backendId,
                    mx.tec.prototipo_01.models.api.ResolveTicketRequest(
                        resolution_comment = "Trabajo completado desde la app Android"
                    )
                )
                if (response.isSuccessful) {
                    Log.d("TecnicoSharedViewModel", "Ticket cerrado exitosamente")
                    // Recargar tickets para reflejar el cambio
                    loadTickets()
                } else {
                    Log.e("TecnicoSharedViewModel", "Error al cerrar ticket: ${response.message()}")
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Exception al cerrar ticket", e)
            }
        }
    }
}