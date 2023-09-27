package br.com.cstag.core.services.analyze

import br.com.cstag.core.dto.toTollTicketAnalysisSearchDto
import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.gateways.SearchEngineGateway
import br.com.cstag.core.repositories.TollTicketRepository
import br.com.cstag.core.services.InvoiceService
import br.com.cstag.core.services.analyze.algorithm.AlgorithmPipeline
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct
import javax.transaction.Transactional

@Service
class AnalyzeTollPlazaService(
    private val tollTicketRepository: TollTicketRepository,
    private val tollTicketAnalyzeService: TollTicketAnalyzeService,
    private val invoiceService: InvoiceService,
    private val searchEngineGateway: SearchEngineGateway
) {
    @Transactional
    fun analyze(tollTicketId: Long) {
        var tollTicket = tollTicketRepository.findByIdOrNull(tollTicketId)
            ?: throw NotFoundException("Toll ticket $tollTicketId not found")

        var isFirstTime = false
        if(tollTicket.analysis == null) {
            isFirstTime = true
        }

        tollTicket.analysis = TollTicketAnalysis(tollTicket)
        tollTicket = tollTicketRepository.save(tollTicket)

        val tollTicketAnalyzed = AlgorithmPipeline(tollTicket)
            .and { tollTicketAnalyzeService.analyzeAxles(it) }
            .and { tollTicketAnalyzeService.analyzeTollPlaza(it) }
            .item
        val tollTicketSaved = tollTicketRepository.save(tollTicketAnalyzed)

        if  (isFirstTime) {
            val invoice = tollTicketSaved.invoice
            invoice.progress.ticketOk()
            invoiceService.save(invoice)
            if (invoice.progress.ticketDone == invoice.progress.ticketTotal) {
                val analysis = tollTicketSaved.invoice.tollTickets.map { it.analysis?.toTollTicketAnalysisSearchDto() }
                searchEngineGateway.save(analysis.filterNotNull().toTypedArray())
            }
        } else {
            val searchDto = tollTicketSaved.analysis!!.toTollTicketAnalysisSearchDto()
            searchEngineGateway.save(arrayOf(searchDto))
        }
    }
}