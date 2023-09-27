package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.TollValleyCredit
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.gateways.Row
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.enums.Source
import java.math.BigDecimal
import java.time.LocalDateTime


object TollValleyCreditFieldRetriever {
    fun retrieveFromRow(row: Row): TollValleyCredit {
        val tollValleyCredit = TollValleyCredit()
        var date = ""
        var time = ""

        row.cells.forEach {
            when (it.index) {
                0 -> tollValleyCredit.licensePlate = LicensePlate(it.stringCellValue())
                1 -> tollValleyCredit.metadata.setKey("tag", it.stringCellValue())
                2 -> date = it.stringCellValue()
                3 -> time = it.stringCellValue()
                4 -> tollValleyCredit.metadata.setKey("description", it.stringCellValue())
                5 -> tollValleyCredit.trip = it.stringCellValue()
                7 -> tollValleyCredit.value = BigDecimal.valueOf(it.numericCellValue())
                8 -> tollValleyCredit.metadata.setKey("shipperName", it.stringCellValue())
                9 -> tollValleyCredit.metadata.setKey("shipperCNPJ", it.stringCellValue())
            }
        }

        tollValleyCredit.operatorCompany = OperatorCompany.SemParar
        tollValleyCredit.receivedAt = FieldRetrieverUtil.getPaidAt(date, time)
        tollValleyCredit.source = Source.Sheet
        return tollValleyCredit
    }
}