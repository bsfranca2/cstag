package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.*
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.gateways.ExcelGateway
import java.io.File
import java.lang.Exception
import javax.transaction.Transactional

open class InvoiceDataMiner(
    private val excelGateway: ExcelGateway
) {
    fun getInvoiceIdentifier(shippingCompany: ShippingCompany, sheetFile: File): Invoice {
        try {
            val workbook = excelGateway.read(sheetFile)
            val invoiceExtracted = InvoiceDataExtraction.extract(workbook)
            val metadata = Metadata()
            metadata.setKey("issueDate", invoiceExtracted.issueDate)
            return Invoice(shippingCompany, invoiceExtracted.number.toString(), OperatorCompany.SemParar, metadata)
        } catch (e: Exception) {
            throw e
        }
    }

    fun extract(invoice: Invoice, sheetFile: File): Result {
        try {
            val workbook = excelGateway.read(sheetFile)
            val tickets = mutableListOf<Ticket>()

            val tollTicketsExtracted = TollTicketDataExtraction.extract(workbook)
            tickets.addAll(tollTicketsExtracted)

            val tollValleyTicketsExtracted = TollValleyTicketDataExtraction.extract(workbook)
            tickets.addAll(tollValleyTicketsExtracted)

            val tollValleyCreditsExtracted = TollValleyCreditDataExtraction.extract(workbook)

            val monthlyPaymentList = MonthlyPaymentDataExtraction.extract(workbook)

            tollValleyCreditsExtracted.forEach { it.invoice = invoice }
            tickets.forEach { it.invoice = invoice }
            monthlyPaymentList.forEach { it.invoice = invoice }

            return Result(
                tickets = tickets,
                credits = tollValleyCreditsExtracted,
                monthlyPayments = monthlyPaymentList
            )

            /*val otherServiceDataExtraction = OtherServiceDataExtraction(excelGateway)
            val otherServiceList = otherServiceDataExtraction.extract(sheetFile)
            otherServiceList.addAll(otherServiceList)*/
        } catch (e: Exception) {
            throw e
        }
    }

    data class Result(
        val tickets: List<Ticket>,
        val credits: List<TollValleyCredit>,
        val monthlyPayments: List<MonthlyPayment>
    )
}