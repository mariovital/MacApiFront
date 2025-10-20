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

    fun getTicketById(id: String): TecnicoTicket? {
        val pending = (pendingTicketsState as? TicketsUiState.Success)?.tickets ?: emptyList()
        val history = (historyTicketsState as? TicketsUiState.Success)?.tickets ?: emptyList()
        return (pending + history).find { it.id == id }
    }

    fun refreshTicketDetail(id: String) {
        // This is a placeholder for future logic to refresh a single ticket
    }

    fun acceptTicket(ticketId: String) {
        // Logic to accept a ticket
    }

    fun rejectTicket(ticketId: String, reason: String?) {
        // Logic to reject a ticket
    }

    fun closeTicket(ticketId: String) {
        // Logic to close a ticket
    }
}