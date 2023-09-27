package br.com.cstag.core.services.analyze

import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.entities.TollValleyCredit
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.CreditAndDebitAnalysisRepository
import br.com.cstag.core.repositories.TicketRepository
import br.com.cstag.core.repositories.TollValleyCreditRepository
import br.com.cstag.core.search.entities.toCreditAndDebitAnalysisSearch
import br.com.cstag.core.search.repositories.CreditAndDebitAnalysisSearchRepository
import br.com.cstag.core.services.AbstractCompanyService
import br.com.cstag.core.services.invoice.InvoiceService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.math.BigDecimal
import javax.transaction.Transactional

@Service
class AnalyzeCreditAndDebitService(
    private val abstractCompanyService: AbstractCompanyService,
    private val creditAndDebitAnalysisRepository: CreditAndDebitAnalysisRepository,
    private val ticketRepository: TicketRepository,
    private val creditRepository: TollValleyCreditRepository,
    private val invoiceService: InvoiceService,
    private val creditAndDebitAnalysisSearchRepository: CreditAndDebitAnalysisSearchRepository

) {
    @Transactional
    fun execute(shippingCompanyCNPJ: CNPJ, trip: String, invoiceId: Long?) {
        if (trip.trim().isBlank()) {
            updateInvoice(invoiceId)
            return
        }

        val shippingCompany = abstractCompanyService.findByCNPJ(shippingCompanyCNPJ).getShippingCompany()
        var analysis = creditAndDebitAnalysisRepository.findByTripAndShippingCompany(trip, shippingCompany)

        val ticketList = ticketRepository
            .findByInvoice_ShippingCompanyAndTrip(shippingCompany, trip)
            .filter { it.invoice?.shippingCompany == shippingCompany }
        val creditList = creditRepository
            .findByInvoice_ShippingCompanyAndTrip(shippingCompany, trip)
            .filter { it.invoice?.shippingCompany == shippingCompany }

        if (ticketList.isEmpty() && creditList.isEmpty()) {
            analysis?.let { creditAndDebitAnalysisRepository.delete(it) }
            return
        } else {
            if (analysis == null)
                analysis = CreditAndDebitAnalysis(shippingCompany, trip)
        }

        analysis.creditList = creditList
        analysis.ticketList = ticketList
        analysis.totalOfCredit = creditList.sumOf { it.value ?: BigDecimal.ZERO }
        analysis.totalOfDebit = ticketList.sumOf { it.fare ?: BigDecimal.ZERO }
        if (analysis.totalOfCredit != analysis.totalOfDebit) {
            analysis.differenceOfValue = if (analysis.totalOfDebit > analysis.totalOfCredit)
                analysis.totalOfDebit.minus(analysis.totalOfCredit) else analysis.totalOfCredit.minus(analysis.totalOfDebit)
            analysis.divergence = if (analysis.totalOfCredit > analysis.totalOfDebit)
                CreditAndDebitAnalysis.Divergence.Credit else CreditAndDebitAnalysis.Divergence.Debit
        }
        analysis.numberOfTransactions = creditList.size + ticketList.size
        analysis.licensePlate = getLicensePlate(ticketList, creditList)
        val ticketListSortedByPaidAt = ticketList.sortedBy { it.paidAt }
        val creditListSortedByReceivedAt = creditList.sortedBy { it.receivedAt }
        kotlin.runCatching {
            val startOfPeriodTicket = ticketListSortedByPaidAt.first().paidAt
            val startOfPeriodCredit = creditListSortedByReceivedAt.first().receivedAt
            startOfPeriodTicket?.let {
                analysis.startOfPeriod = if (it.isBefore(startOfPeriodCredit)) startOfPeriodTicket else startOfPeriodCredit
            }
        }
        kotlin.runCatching {
            val endOfPeriodTicket = ticketListSortedByPaidAt.last().paidAt
            val endOfPeriodCredit = creditListSortedByReceivedAt.last().receivedAt
            endOfPeriodTicket?.let {
                analysis.endOfPeriod = if (it.isAfter(endOfPeriodCredit)) endOfPeriodTicket else endOfPeriodCredit
            }
        }

        val analysisSaved = creditAndDebitAnalysisRepository.save(analysis)
        creditAndDebitAnalysisSearchRepository.save(analysisSaved.toCreditAndDebitAnalysisSearch())
        updateInvoice(invoiceId)
    }

    private fun getLicensePlate(
        ticketList: List<Ticket>,
        creditList: List<TollValleyCredit>,
    ): LicensePlate? {
        val licensePlateList = mutableListOf<LicensePlate>()
        ticketList.forEach { ticket ->
            ticket.licensePlate?.let { licensePlateList.add(it) }
        }
        creditList.forEach { credit ->
            credit.licensePlate?.let { licensePlateList.add(it) }
        }
        return licensePlateList.find { it.value.length == 7 }
    }

    private fun updateInvoice(invoiceId: Long?) {
        invoiceId?.let {
            val invoice = invoiceService.findById(invoiceId)
            invoice.progress.creditOk()
            invoiceService.save(invoice)
        }
    }

    fun details(shippingCompanyCNPJ: CNPJ, analysisId: Long): CreditAndDebitAnalysis {
        return creditAndDebitAnalysisRepository.findByIdOrNull(analysisId)
            ?: throw NotFoundException("Análise não encontrada: $analysisId")
    }
}