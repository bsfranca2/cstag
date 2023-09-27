package br.com.cstag.api.controllers

import br.com.cstag.api.dto.TicketAnalysisDto
import br.com.cstag.api.dto.toTollTicketAnalysisDto
import br.com.cstag.core.services.TicketService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/tickets")
class TicketController {
    @Autowired
    lateinit var ticketService: TicketService

    @GetMapping("/{id}/analysis")
    fun getAnalysis(@PathVariable id: Long): TicketAnalysisDto? {
        return ticketService.findById(id).analysis?.toTollTicketAnalysisDto()
    }
}