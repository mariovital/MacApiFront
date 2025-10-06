package mx.tec.prototipo_01.viewmodels

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.models.TicketStatus

class MesaAyudaSharedViewModel : ViewModel() {
    // Dummy data for pending tickets
    private val _pendingTickets = mutableStateListOf(
        TecnicoTicket(
            id = "INC000000903612",
            title = "Problema con la red",
            company = "Coca-Cola",
            assignedTo = "Juan Perez",
            status = TicketStatus.PENDIENTE,
            priority = "Alta",
            description = "El usuario reporta que no puede conectarse a la red de la empresa.",
            date = "2024-05-20"
        ),
        TecnicoTicket(
            id = "INC000000903613",
            title = "Falla en la impresora",
            company = "Pepsi",
            assignedTo = "Maria Rodriguez",
            status = TicketStatus.EN_PROCESO,
            priority = "Media",
            description = "La impresora del departamento de contabilidad no imprime.",
            date = "2024-05-19"
        )
    )

    // Dummy data for history tickets
    private val _historyTickets = mutableStateListOf(
        TecnicoTicket(
            id = "INC000000903610",
            title = "Correo no funciona",
            company = "Google",
            assignedTo = "Juan Perez",
            status = TicketStatus.COMPLETADO,
            priority = "Baja",
            description = "El correo del usuario no se actualiza.",
            date = "2024-05-18"
        ),
        TecnicoTicket(
            id = "INC000000903611",
            title = "Problema con el software",
            company = "Microsoft",
            assignedTo = "Maria Rodriguez",
            status = TicketStatus.RECHAZADO,
            priority = "Alta",
            description = "El software de diseño no abre.",
            date = "2024-05-17"
        )
    )

    val pendingTickets: List<TecnicoTicket> = _pendingTickets
    val historyTickets: List<TecnicoTicket> = _historyTickets
}