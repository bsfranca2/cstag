package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.Source
import br.com.cstag.core.gateways.Row
import java.math.BigDecimal
import java.time.LocalDateTime

object TollTicketFieldRetriever {
    fun retrieveFromRow(row: Row): Ticket {
        val tollTicket = Ticket()
        var date = ""
        var time = ""

        row.cells.forEach {
            when (it.index) {
                0 -> tollTicket.licensePlate = LicensePlate(it.stringCellValue())
                1 -> tollTicket.metadata.setKey("tag", it.stringCellValue())
                3 -> tollTicket.metadata.setKey("brand", it.stringCellValue())
                4 -> tollTicket.category = it.stringCellValue().toInt()
                5 -> date = it.stringCellValue()
                6 -> time = it.stringCellValue()
                8 -> tollTicket.highway = it.stringCellValue()
                9 -> tollTicket.fare = BigDecimal.valueOf(it.numericCellValue())
            }
        }

        tollTicket.paidAt = FieldRetrieverUtil.getPaidAt(date, time)
        tollTicket.operatorCompany = OperatorCompany.SemParar
        tollTicket.source = Source.Sheet
        return tollTicket
    }
}