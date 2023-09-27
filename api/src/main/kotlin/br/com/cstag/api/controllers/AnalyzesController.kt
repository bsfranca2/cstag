package br.com.cstag.api.controllers

import br.com.cstag.api.dto.CreditAndDebitDetailsDto
import br.com.cstag.api.dto.toCreditAndDebitDetailsDto
import br.com.cstag.api.security.AccountLoggedContextService
import br.com.cstag.core.dto.CreditDebitAnalysisFilterDto
import br.com.cstag.core.dto.CreditDebitStatisticsDto
import br.com.cstag.core.dto.PaginationDto
import br.com.cstag.core.dto.TicketAnalysisFilterDto
import br.com.cstag.core.search.entities.CreditAndDebitAnalysisSearch
import br.com.cstag.core.search.entities.TicketAnalysisSearch
import br.com.cstag.core.services.analyze.AnalyzeCreditAndDebitService
import br.com.cstag.core.services.analyze.AnalyzesSearchService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/analyzes")
class AnalyzesController {

    @Autowired
    lateinit var analyzesSearchService: AnalyzesSearchService

    @Autowired
    lateinit var accountLoggedContextService: AccountLoggedContextService

    @Autowired
    lateinit var creditAndDebitService: AnalyzeCreditAndDebitService

    fun getAccount() =
        accountLoggedContextService.getAccount()

    @RequestMapping("/ticket-analysis/search")
    fun listTicket(
        @RequestBody dto: TicketAnalysisFilterDto?,
        @RequestParam perPage: Int? = null,
        @RequestParam page: Int? = null
    ): PaginationDto<TicketAnalysisSearch> {
        val filterDto = dto ?: TicketAnalysisFilterDto()
        filterDto.shippingCompanyCNPJ = getAccount().company.cnpj.value
        return analyzesSearchService.search(filterDto, perPage, page)
    }

    @RequestMapping("/credit-debit-analysis/search")
    fun listCreditDebit(
        @RequestBody dto: CreditDebitAnalysisFilterDto?,
        @RequestParam perPage: Int? = null,
        @RequestParam page: Int? = null
    ): PaginationDto<CreditAndDebitAnalysisSearch> {
        val filterDto = dto ?: CreditDebitAnalysisFilterDto()
        filterDto.shippingCompanyCNPJ = getAccount().company.cnpj.value
        return analyzesSearchService.searchPaginate(filterDto, perPage, page)
    }

    @RequestMapping("/credit-debit-analysis/statistics")
    fun statisticsCreditAndDebit(
        @RequestBody dto: CreditDebitAnalysisFilterDto?,
    ): CreditDebitStatisticsDto {
        val filterDto = dto ?: CreditDebitAnalysisFilterDto()
        filterDto.shippingCompanyCNPJ = getAccount().company.cnpj.value
        return analyzesSearchService.statistics(filterDto)
    }

    @RequestMapping("/credit-debit-analysis/{id}")
    fun creditAndDebitDetails(@PathVariable id: Long): CreditAndDebitDetailsDto {
        val shippingCompany = getAccount().company.cnpj
        return creditAndDebitService.details(shippingCompany, id).toCreditAndDebitDetailsDto()
    }
}