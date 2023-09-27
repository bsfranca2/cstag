package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.gateways.Workbook
import br.com.cstag.core.gateways.withoutHeader

object TollTicketDataExtraction {
    private const val TOLL_TICKET_SHEET_INDEX = 4

    fun extract(workbook: Workbook): MutableList<Ticket> {
        val sheet = workbook.sheets.getOrNull(TOLL_TICKET_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val tollTickets = mutableListOf<Ticket>()
        val rows = sheet.rows.toMutableList().withoutHeader()
        rows.forEach {
            val tollTicket = TollTicketFieldRetriever.retrieveFromRow(it)
            tollTickets.add(tollTicket)
        }
        return tollTickets
    }
}