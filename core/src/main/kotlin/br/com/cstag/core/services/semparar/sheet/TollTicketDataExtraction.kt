package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.TollTicketSemParar
import br.com.cstag.core.gateways.Workbook

object TollTicketDataExtraction {
    private const val TOLL_TICKET_SHEET_INDEX = 4

    fun extract(workbook: Workbook): MutableList<TollTicketSemParar> {
        val sheet = workbook.sheets.getOrNull(TOLL_TICKET_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val tollTickets = mutableListOf<TollTicketSemParar>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            val tollTicket = TollTicketFieldRetriever.retrieveFromRow(it)
            tollTickets.add(tollTicket)
        }
        return tollTickets
    }
}