package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import br.com.cstag.core.gateways.Workbook

object TollValleyTicketDataExtraction {
    private const val TOLL_VALLEY_TICKET_SHEET_INDEX = 6

    fun extract(workbook: Workbook): MutableList<TollValleyTicketSemParar> {
        val sheet = workbook.sheets.getOrNull(TOLL_VALLEY_TICKET_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val tollValleyTickets = mutableListOf<TollValleyTicketSemParar>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            val tollValleyTicket = TollValleyTicketFieldRetriever.retrieveFromRow(it)
            tollValleyTickets.add(tollValleyTicket)
        }
        return tollValleyTickets
    }
}