package br.com.cstag.core.services.analyze

import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.TicketRepository
import br.com.cstag.core.search.entities.toTicketAnalysisSearch
import br.com.cstag.core.search.repositories.TicketAnalysisSearchRepository
import br.com.cstag.core.services.invoice.InvoiceService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class TicketAnalysisService(
    private val analyzeTicketService: AnalyzeTicketService,
    private val ticketRepository: TicketRepository,
    private val invoiceService: InvoiceService,
    private val ticketAnalysisSearchRepository: TicketAnalysisSearchRepository
) {
    @Transactional
    fun analyze(tollTicketId: Long) {
        val ticket = ticketRepository.findByIdOrNull(tollTicketId)
            ?: throw NotFoundException("Passagem $tollTicketId não encontrada")

        var isFirstTime = false
        if(ticket.analysis == null) {
            isFirstTime = true
        }

        val ticketAnalyzed = analyzeTicketService.analyze(ticket)
        val ticketSaved = ticketRepository.save(ticketAnalyzed)
        ticketAnalysisSearchRepository.save(ticketSaved.analysis!!.toTicketAnalysisSearch())

        if  (isFirstTime) {
            val invoice = ticketSaved.invoice
            invoice?.let {
                invoice.progress.ticketOk()
                invoiceService.save(it)
            }
        }
    }
}