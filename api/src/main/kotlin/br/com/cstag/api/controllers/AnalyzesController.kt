package br.com.cstag.api.controllers

import br.com.cstag.api.dto.TollTicketAnalysisDto
import br.com.cstag.api.dto.toTollTicketAnalysisDto
import br.com.cstag.api.security.GetAccountLoggedContextService
import br.com.cstag.core.dto.*
import br.com.cstag.core.services.AnalyzeSearchService
import br.com.cstag.core.services.TollTicketAnalysisService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/analyzes/")
class AnalyzesController {
    @Autowired
    lateinit var analyzeSearchService: AnalyzeSearchService

    @Autowired
    lateinit var tollTicketAnalysisService: TollTicketAnalysisService

    @Autowired
    lateinit var getAccountLoggedContextService: GetAccountLoggedContextService

    @PostMapping("/toll-ticket/search")
    fun searchTollTicket(
        @RequestBody dto: TollTicketAnalysisFilterDto,
        @RequestParam perPage: Int? = null,
        @RequestParam page: Int? = null
    ): SearchResultDto<TollTicketAnalysisSearchDto> {
        dto.shippingCompanyCNPJ = getAccountLoggedContextService.getAccountCNPJ()
        return analyzeSearchService.search(dto, PaginateDto(perPage, page))
    }

    @GetMapping("/toll-ticket/{id}")
    fun getTollTicketById(@PathVariable id: Long): TollTicketAnalysisDto? {
        return tollTicketAnalysisService.findById(id)?.toTollTicketAnalysisDto()
    }

    @PostMapping("/credit-debit/search")
    fun searchCreditAndDebit(
        @RequestBody dto: CreditAndDebitAnalysisFilterDto,
        @RequestParam perPage: Int? = null,
        @RequestParam page: Int? = null
    ): SearchResultDto<CreditAndDebitAnalysisSearchDto> {
        dto.shippingCompanyCNPJ = getAccountLoggedContextService.getAccountCNPJ()
        return analyzeSearchService.search(dto, PaginateDto(perPage, page))
    }
}