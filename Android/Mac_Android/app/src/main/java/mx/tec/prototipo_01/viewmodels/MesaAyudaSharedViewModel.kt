package mx.tec.prototipo_01.viewmodels

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import mx.tec.prototipo_01.models.TecnicoTicket
import mx.tec.prototipo_01.models.TicketStatus

class MesaAyudaSharedViewModel : ViewModel() {
    // Dummy data for pending tickets
    private val _pendingTickets = mutableStateListOf(
        TecnicoTicket(
            backendId = 1001,
            id = "INC000000903612",
            title = "Problema con la red",
            company = "Coca-Cola",
            assignedTo = "Juan Perez",
            status = TicketStatus.PENDIENTE,
            priority = "Alta",
            description = "El usuario reporta que no puede conectarse a la red de la empresa.",
            date = "2024-05-20",
            location = "Oficina 301",
            priorityJustification = "Urgente",
            clientContact = "Cliente 1",
            clientEmail = "cliente1@email.com",
            clientPhone = "123456789",
            clientDepartment = "Ventas",
            categoryName = "Redes"
        ),
        TecnicoTicket(
            backendId = 1002,
            id = "INC000000903613",
            title = "Falla en la impresora",
            company = "Pepsi",
            assignedTo = "Maria Rodriguez",
            status = TicketStatus.EN_PROCESO,
            priority = "Media",
            description = "La impresora del departamento de contabilidad no imprime.",
            date = "2024-05-19",
            location = "Piso 2",
            priorityJustification = null,
            clientContact = "Cliente 2",
            clientEmail = "cliente2@email.com",
            clientPhone = "987654321",
            clientDepartment = "Contabilidad",
            categoryName = "Hardware"
        )
    )

    // Dummy data for history tickets
    private val _historyTickets = mutableStateListOf(
        TecnicoTicket(
            backendId = 999,
            id = "INC000000903610",
            title = "Correo no funciona",
            company = "Google",
            assignedTo = "Juan Perez",
            status = TicketStatus.COMPLETADO,
            priority = "Baja",
            description = "El correo del usuario no se actualiza.",
            date = "2024-05-18",
            location = "Remoto",
            priorityJustification = null,
            clientContact = "Cliente 3",
            clientEmail = "cliente3@email.com",
            clientPhone = "1122334455",
            clientDepartment = "Soporte",
            categoryName = "Software"
        ),
        TecnicoTicket(
            backendId = 998,
            id = "INC000000903611",
            title = "Problema con el software",
            company = "Microsoft",
            assignedTo = "Maria Rodriguez",
            status = TicketStatus.RECHAZADO,
            priority = "Alta",
            description = "El software de diseño no abre.",
            date = "2024-05-17",
            location = "Edificio B, Nivel 4",
            priorityJustification = "No es un problema de software",
            clientContact = "Cliente 4",
            clientEmail = "cliente4@email.com",
            clientPhone = "5566778899",
            clientDepartment = "Diseño",
            categoryName = "Software"
        )
    )

    val pendingTickets: List<TecnicoTicket> = _pendingTickets
    val historyTickets: List<TecnicoTicket> = _historyTickets
}