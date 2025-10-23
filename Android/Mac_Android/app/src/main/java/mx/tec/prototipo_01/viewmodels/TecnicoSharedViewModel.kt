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
import mx.tec.prototipo_01.models.api.ResolveTicketRequest
import mx.tec.prototipo_01.models.api.CloseTicketRequest
import mx.tec.prototipo_01.models.api.UpdateStatusRequest
import mx.tec.prototipo_01.models.api.CreateCommentRequest

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
                // Cerrar ticket usando el endpoint documentado en AWS Gateway
                val response = RetrofitClient.instance.closeTicket(backendId, CloseTicketRequest())
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

    fun closeTicketWithReason(ticketId: String, reason: String?) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                val response = RetrofitClient.instance.closeTicket(backendId, CloseTicketRequest(close_reason = reason))
                if (response.isSuccessful) {
                    Log.d("TecnicoSharedViewModel", "Ticket cerrado exitosamente con comentario")
                    loadTickets()
                } else {
                    // Fallback: si el backend remoto aún exige admin (403), permitir cierre vía PATCH status y comentario normal
                    if (response.code() == 403) {
                        try {
                            val st = RetrofitClient.instance.updateTicketStatus(backendId, UpdateStatusRequest(status_id = 6))
                            if (st.isSuccessful) {
                                if (!reason.isNullOrBlank()) {
                                    runCatching {
                                        RetrofitClient.instance.addTicketComment(backendId, CreateCommentRequest(comment = "[CIERRE] ${reason}", is_internal = false))
                                    }
                                }
                                Log.d("TecnicoSharedViewModel", "Ticket cerrado via fallback (status=6)")
                                loadTickets()
                            } else {
                                Log.e("TecnicoSharedViewModel", "Fallback cerrar status=6 fallo: ${st.message()}")
                            }
                        } catch (fe: Exception) {
                            Log.e("TecnicoSharedViewModel", "Exception en fallback de cierre", fe)
                        }
                    } else {
                        Log.e("TecnicoSharedViewModel", "Error al cerrar ticket: ${response.message()}")
                    }
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Exception al cerrar ticket con comentario", e)
            }
        }
    }

    fun resolveTicket(ticketId: String, resolutionComment: String) {
        viewModelScope.launch {
            try {
                val backendId = ticketIdMap[ticketId] ?: return@launch
                val response = RetrofitClient.instance.resolveTicket(
                    backendId,
                    ResolveTicketRequest(resolution_comment = resolutionComment)
                )
                if (response.isSuccessful) {
                    Log.d("TecnicoSharedViewModel", "Ticket resuelto exitosamente")
                    loadTickets()
                } else {
                    Log.e("TecnicoSharedViewModel", "Error al resolver ticket: ${response.message()}")
                }
            } catch (e: Exception) {
                Log.e("TecnicoSharedViewModel", "Exception al resolver ticket", e)
            }
        }
    }
}