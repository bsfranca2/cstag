package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.entities.semparar.InvoiceSemParar
import br.com.cstag.core.gateways.ExcelGateway
import java.io.File
import java.lang.Exception
import javax.transaction.Transactional

open class InvoiceDataMiner(
    private val excelGateway: ExcelGateway
) {
    fun getInvoiceIdentifier(shippingCompany: ShippingCompany, sheetFile: File): InvoiceSemParar {
        try {
            val workbook = excelGateway.read(sheetFile)
            val invoiceExtracted = InvoiceDataExtraction.extract(workbook)
            return InvoiceSemParar(invoiceExtracted.number, invoiceExtracted.dateOfIssue, shippingCompany)
        } catch (e: Exception) {
            throw e
        }
    }

    fun extract(shippingCompany: ShippingCompany, sheetFile: File): InvoiceSemParar {
        try {
            val workbook = excelGateway.read(sheetFile)

            val invoiceExtracted = InvoiceDataExtraction.extract(workbook)
            val invoice = InvoiceSemParar(invoiceExtracted.number, invoiceExtracted.dateOfIssue, shippingCompany)

            val tollTicketsExtracted = TollTicketDataExtraction.extract(workbook)
            invoice.tollTickets.addAll(tollTicketsExtracted)
            val tollValleyTicketsExtracted = TollValleyTicketDataExtraction.extract(workbook)
            invoice.tollTickets.addAll(tollValleyTicketsExtracted)

            invoice.tollTickets.forEach { it.invoice = invoice }

            val tollValleyCreditsExtracted = TollValleyCreditDataExtraction.extract(workbook)
            invoice.tollValleyCredits.addAll(tollValleyCreditsExtracted)
            invoice.tollValleyCredits.forEach { it.invoice = invoice }

            val monthlyPaymentList = MonthlyDataExtraction.extract(workbook)
            monthlyPaymentList.forEach { it.invoice = invoice }
            invoice.monthlyPayments.addAll(monthlyPaymentList)

            /*val otherServiceDataExtraction = OtherServiceDataExtraction(excelGateway)
            val otherServiceList = otherServiceDataExtraction.extract(sheetFile)
            otherServiceList.addAll(otherServiceList)*/

            return invoice
        } catch (e: Exception) {
            throw e
        }
    }
}