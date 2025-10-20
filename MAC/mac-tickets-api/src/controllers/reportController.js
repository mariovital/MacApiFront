// /controllers/reportController.js - Controlador de Reportes

import { Ticket, User, Category, Priority, TicketStatus, Role } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import XLSX from 'xlsx';

/**
 * GET /api/reports/dashboard
 * Obtener estadísticas generales para el dashboard de reportes
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { dateRange = '30days' } = req.query;

    // Calcular fechas según el rango
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // 1. Total de tickets en el período
    const totalTickets = await Ticket.count({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      }
    });

    // 2. Tickets resueltos
    const resolvedTickets = await Ticket.count({
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status_id: 5 // Resuelto
      }
    });

    // 3. Tickets cerrados
    const closedTickets = await Ticket.count({
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status_id: 6 // Cerrado
      }
    });

    // 4. Tiempo promedio de resolución (en horas)
    const resolvedTicketsWithTime = await Ticket.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status_id: { [Op.in]: [5, 6] }, // Resuelto o Cerrado
        resolved_at: { [Op.not]: null }
      },
      attributes: ['created_at', 'resolved_at']
    });

    let averageResolutionTime = 0;
    if (resolvedTicketsWithTime.length > 0) {
      const totalHours = resolvedTicketsWithTime.reduce((sum, ticket) => {
        const diff = new Date(ticket.resolved_at) - new Date(ticket.created_at);
        return sum + (diff / (1000 * 60 * 60)); // Convertir a horas
      }, 0);
      averageResolutionTime = (totalHours / resolvedTicketsWithTime.length).toFixed(1);
    }

    // 5. Cumplimiento de SLA (basado en prioridad)
    const slaCompliance = totalTickets > 0 
      ? Math.round((resolvedTickets / totalTickets) * 100) 
      : 0;

    // 6. Tickets por categoría
    const ticketsByCategory = await Ticket.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color']
        }
      ],
      attributes: ['category_id', [fn('COUNT', col('Ticket.id')), 'count']],
      group: ['category_id', 'category.id'],
      raw: false
    });

    const categoryStats = ticketsByCategory.map(item => ({
      name: item.category?.name || 'Sin categoría',
      total: parseInt(item.dataValues.count),
      percentage: totalTickets > 0 ? Math.round((parseInt(item.dataValues.count) / totalTickets) * 100) : 0,
      color: item.category?.color || '#6B7280'
    }));

    // 7. Tickets por prioridad
    const ticketsByPriority = await Ticket.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      include: [
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'color']
        }
      ],
      attributes: ['priority_id', [fn('COUNT', col('Ticket.id')), 'count']],
      group: ['priority_id', 'priority.id'],
      raw: false
    });

    const priorityStats = ticketsByPriority.map(item => ({
      level: item.priority?.name || 'Sin prioridad',
      count: parseInt(item.dataValues.count),
      percentage: totalTickets > 0 ? Math.round((parseInt(item.dataValues.count) / totalTickets) * 100) : 0,
      color: item.priority?.color || '#6B7280'
    }));

    // 8. Rendimiento por técnico
    const technicianStats = await Ticket.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        assigned_to: { [Op.not]: null }
      },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name'],
          where: { role_id: 2 } // Solo técnicos
        }
      ],
      attributes: [
        'assigned_to',
        [fn('COUNT', col('Ticket.id')), 'totalAssigned'],
        [fn('SUM', literal("CASE WHEN status_id IN (5, 6) THEN 1 ELSE 0 END")), 'resolved'],
        [fn('SUM', literal("CASE WHEN status_id NOT IN (5, 6) THEN 1 ELSE 0 END")), 'pending']
      ],
      group: ['assigned_to', 'assignee.id'],
      raw: false
    });

    const technicianStatsFormatted = technicianStats.map(item => {
      const resolved = parseInt(item.dataValues.resolved) || 0;
      const totalAssigned = parseInt(item.dataValues.totalAssigned) || 0;
      const efficiency = totalAssigned > 0 ? Math.round((resolved / totalAssigned) * 100) : 0;
      
      return {
        name: `${item.assignee.first_name} ${item.assignee.last_name}`,
        resolved: resolved,
        pending: parseInt(item.dataValues.pending) || 0,
        rating: 0, // Placeholder - implementar sistema de calificación
        efficiency: efficiency
      };
    });

    // 9. Tendencias (comparar con período anterior)
    const prevStartDate = new Date(startDate);
    switch (dateRange) {
      case '7days':
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        break;
      case '30days':
        prevStartDate.setDate(prevStartDate.getDate() - 30);
        break;
      case '90days':
        prevStartDate.setDate(prevStartDate.getDate() - 90);
        break;
      case '1year':
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        break;
    }

    const prevTotalTickets = await Ticket.count({
      where: {
        created_at: {
          [Op.gte]: prevStartDate,
          [Op.lt]: startDate
        }
      }
    });

    const ticketsGrowth = prevTotalTickets > 0 
      ? (((totalTickets - prevTotalTickets) / prevTotalTickets) * 100).toFixed(1)
      : 0;

    // Respuesta final
    res.json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        stats: {
          totalTickets,
          resolvedTickets,
          closedTickets,
          averageResolutionTime: `${averageResolutionTime} horas`,
          slaCompliance,
          trends: {
            ticketsGrowth: parseFloat(ticketsGrowth),
            resolutionImprovement: 0 // Placeholder
          }
        },
        categoryStats,
        priorityStats,
        technicianStats: technicianStatsFormatted,
        dateRange,
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * GET /api/reports/export
 * Generar y descargar reporte en formato Excel
 */
export const exportToExcel = async (req, res) => {
  try {
    const { dateRange = '30days' } = req.query;

    // Calcular fechas
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Obtener tickets del período
    const tickets = await Ticket.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['name']
        },
        {
          model: TicketStatus,
          as: 'status',
          attributes: ['name']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['first_name', 'last_name']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // ✅ VALIDACIÓN: Si no hay tickets, retornar error
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay tickets en el período seleccionado',
        code: 'NO_DATA'
      });
    }

    // Formatear datos para Excel
    const excelData = tickets.map(ticket => ({
      'ID': ticket.ticket_number || `#${ticket.id}`,
      'Título': ticket.title,
      'Categoría': ticket.category?.name || 'Sin categoría',
      'Prioridad': ticket.priority?.name || 'Sin prioridad',
      'Estado': ticket.status?.name || 'Desconocido',
      'Creado por': ticket.creator ? `${ticket.creator.first_name} ${ticket.creator.last_name}` : 'Desconocido',
      'Asignado a': ticket.assignee ? `${ticket.assignee.first_name} ${ticket.assignee.last_name}` : 'Sin asignar',
      'Empresa': ticket.client_company || 'N/A',
      'Contacto': ticket.client_contact || 'N/A',
      'Ubicación': ticket.location || 'N/A',
      'Fecha Creación': new Date(ticket.created_at).toLocaleString('es-MX'),
      'Fecha Resolución': ticket.resolved_at ? new Date(ticket.resolved_at).toLocaleString('es-MX') : 'Pendiente'
    }));

    // Crear workbook y worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 12 },  // ID
      { wch: 40 },  // Título
      { wch: 20 },  // Categoría
      { wch: 12 },  // Prioridad
      { wch: 15 },  // Estado
      { wch: 25 },  // Creado por
      { wch: 25 },  // Asignado a
      { wch: 25 },  // Empresa
      { wch: 20 },  // Contacto
      { wch: 20 },  // Ubicación
      { wch: 20 },  // Fecha Creación
      { wch: 20 }   // Fecha Resolución
    ];
    worksheet['!cols'] = columnWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');

    // Generar buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Nombre del archivo con fecha
    const fileName = `Reporte_Tickets_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Enviar archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(excelBuffer);

    console.log(`✅ Reporte Excel generado: ${fileName} (${tickets.length} tickets)`);

  } catch (error) {
    console.error('❌ Error generando reporte Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte'
    });
  }
};

export default {
  getDashboardStats,
  exportToExcel
};

