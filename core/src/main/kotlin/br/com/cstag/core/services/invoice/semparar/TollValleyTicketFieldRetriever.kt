package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.Source
import br.com.cstag.core.gateways.Row
import br.com.cstag.core.valueobjects.CNPJ
import java.math.BigDecimal
import java.time.LocalDateTime

object TollValleyTicketFieldRetriever {
    fun retrieveFromRow(row: Row): Ticket {
        val ticket = Ticket()
        var date = ""
        var time = ""

        row.cells.forEach {
            when (it.index) {
                0 -> ticket.licensePlate = LicensePlate(it.stringCellValue())
                1 -> ticket.metadata.setKey("tag", it.stringCellValue())
                3 -> ticket.metadata.setKey("brand", it.stringCellValue())
                4 -> ticket.category = it.stringCellValue().toInt()
                5 -> date = it.stringCellValue()
                6 -> time = it.stringCellValue()
                8 -> ticket.highway = it.stringCellValue()
                9 -> ticket.fare = BigDecimal.valueOf(it.numericCellValue())
                10 -> ticket.trip = it.stringCellValue()
                11 -> ticket.metadata.setKey("shipperName", it.stringCellValue())
                12 -> ticket.metadata.setKey("shipperCNPJ", it.stringCellValue())
            }
        }

        ticket.type = Ticket.Type.TollValleyTicket
        ticket.paidAt = FieldRetrieverUtil.getPaidAt(date, time)
        ticket.operatorCompany = OperatorCompany.SemParar
        ticket.source = Source.Sheet
        return ticket
    }
}