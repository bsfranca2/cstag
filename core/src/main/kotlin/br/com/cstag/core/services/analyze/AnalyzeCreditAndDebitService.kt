package br.com.cstag.core.services.analyze

import br.com.cstag.core.dto.toCreditAndDebitAnalysisSearchDto
import br.com.cstag.core.entities.*
import br.com.cstag.core.entities.semparar.TollValleyCreditSemParar
import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import br.com.cstag.core.enums.DivergenceStatus
import br.com.cstag.core.gateways.SearchEngineGateway
import br.com.cstag.core.repositories.CreditAndDebitAnalysisRepository
import br.com.cstag.core.repositories.semparar.TollValleyCreditSemPararRepository
import br.com.cstag.core.repositories.semparar.TollValleyTicketSemPararRepository
import br.com.cstag.core.services.CompanyService
import br.com.cstag.core.services.InvoiceService
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class AnalyzeCreditAndDebitService(
    private val companyService: CompanyService,
    private val creditAndDebitAnalysisRepository: CreditAndDebitAnalysisRepository,
    private val tollValleyTicketSemPararRepository: TollValleyTicketSemPararRepository,
    private val tollValleyCreditSemPararRepository: TollValleyCreditSemPararRepository,
    private val invoiceService: InvoiceService,
    private val searchEngineGateway: SearchEngineGateway
) {
    @Transactional
    fun execute(shippingCompanyCNPJ: CNPJ, trip: String, invoiceId: Long?) {
        if (trip.trim().isBlank())
            return

        val shippingCompany = companyService.findByCNPJ(shippingCompanyCNPJ).getShippingCompany()
        var analysis = creditAndDebitAnalysisRepository.findByTripAndShippingCompany(trip, shippingCompany)

        val ticketList = tollValleyTicketSemPararRepository
            .findByTrip(trip)
            .filter { it.invoice.shippingCompany == shippingCompany }
        val creditList = tollValleyCreditSemPararRepository
            .findByTrip(trip)
            .filter { it.invoice.shippingCompany == shippingCompany }

        if (ticketList.isEmpty() && creditList.isEmpty()) {
            analysis?.let {
                creditAndDebitAnalysisRepository.delete(it)
            }
            return
        } else {
            if (analysis == null)
                analysis = CreditAndDebitAnalysis(shippingCompany, trip)
        }

        analysis.totalOfCredit = creditList.sumOf { it.value }
        analysis.totalOfDebit = ticketList.sumOf { it.fare }
        if (analysis.totalOfCredit != analysis.totalOfDebit) {
            analysis.differenceOfValue = if (analysis.totalOfDebit > analysis.totalOfCredit)
                analysis.totalOfDebit.minus(analysis.totalOfCredit) else analysis.totalOfCredit.minus(analysis.totalOfDebit)
            analysis.divergence = CreditAndDebitAnalysisDivergence(
                type = if (analysis.totalOfCredit > analysis.totalOfDebit)
                    CreditAndDebitAnalysisDivergence.Type.Credit else CreditAndDebitAnalysisDivergence.Type.Debit,
                status = DivergenceStatus.Pending
            )
        }
        analysis.numberOfTransactions = creditList.size + ticketList.size
        analysis.licensePlate = getLicensePlate(ticketList, creditList)
        val ticketListSortedByPaidAt = ticketList.sortedBy { it.paidAt }
        val creditListSortedByReceivedAt = creditList.sortedBy { it.receivedAt }
        kotlin.runCatching {
            val startOfPeriodTicket = ticketListSortedByPaidAt.first().paidAt
            val startOfPeriodCredit = creditListSortedByReceivedAt.first().receivedAt
            analysis.startOfPeriod = if (startOfPeriodTicket.isBefore(startOfPeriodCredit)) startOfPeriodTicket else startOfPeriodCredit
        }
        kotlin.runCatching {
            val endOfPeriodTicket = ticketListSortedByPaidAt.last().paidAt
            val endOfPeriodCredit = creditListSortedByReceivedAt.last().receivedAt
            analysis.endOfPeriod = if (endOfPeriodTicket.isAfter(endOfPeriodCredit)) endOfPeriodTicket else endOfPeriodCredit
        }
        creditAndDebitAnalysisRepository.save(analysis)

        if (invoiceId != null) {
            val invoice = invoiceService.findById(invoiceId)
            invoice.progress.creditOk()
            invoiceService.save(invoice)
            kotlin.runCatching {
                if (invoice.progress.creditTotal == invoice.progress.creditDone.size) {
                    val trips = getTollValleyTrip(invoice)
                    val analysisList = creditAndDebitAnalysisRepository.findByShippingCompanyAndTripIn(shippingCompany, trips)
                    searchEngineGateway.save(analysisList.map { it.toCreditAndDebitAnalysisSearchDto() }.toTypedArray())
                }
            }
        } else {
            searchEngineGateway.save(arrayOf(analysis.toCreditAndDebitAnalysisSearchDto()))
        }
    }

    private fun getLicensePlate(
        ticketList: List<TollValleyTicketSemParar>,
        creditList: List<TollValleyCreditSemParar>,
    ): LicensePlate? {
        val licensePlateList = mutableListOf<LicensePlate>()
        ticketList.map { licensePlateList.add(it.licensePlate) }
        creditList.map { licensePlateList.add(it.licensePlate) }
        return licensePlateList.find { it.value.length == 7 }
    }

    private fun getTollValleyTrip(invoice: Invoice): MutableSet<String> {
        val trips = mutableSetOf<String>()
        invoice.tollTickets.forEach {
            if (it is TollValleyTicketSemParar)
                it.trip?.let { trip -> trips.add(trip) }
        }
        invoice.tollValleyCredits.forEach {
            if (it is TollValleyCreditSemParar)
                it.trip?.let { trip -> trips.add(trip) }
        }
        return trips
    }
}