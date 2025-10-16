package mx.tec.prototipo_01.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.tec.prototipo_01.models.TicketPriority
import mx.tec.prototipo_01.models.TicketStatus

@Composable
fun StatusBadge(status: String) {
    val statusEnum = remember(status) { TicketStatus.values().find { it.displayName.equals(status, ignoreCase = true) } }
    if (statusEnum != null) {
        Box(
            modifier = Modifier
                .background(statusEnum.color, RoundedCornerShape(8.dp))
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(statusEnum.displayName, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 12.sp)
        }
    }
}

@Composable
fun PriorityBadge(priority: String) {
    val priorityEnum = remember(priority) { TicketPriority.values().find { it.displayName.equals(priority, ignoreCase = true) } }
    val color = priorityEnum?.color ?: Color(0xFF69696E)
    val label = priorityEnum?.displayName ?: (priority.ifBlank { "N/A" })
    Box(
        modifier = Modifier
            .background(color, RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(label, color = Color.White, fontWeight = FontWeight.Medium, fontSize = 12.sp)
    }
}
