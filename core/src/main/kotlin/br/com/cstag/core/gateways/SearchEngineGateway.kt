package br.com.cstag.core.gateways

import br.com.cstag.core.dto.*

interface SearchEngineGateway {
    fun search(filter: TollTicketAnalysisFilterDto, paginateDto: PaginateDto): SearchResultDto<TollTicketAnalysisSearchDto>
    fun search(filter: CreditAndDebitAnalysisFilterDto, paginateDto: PaginateDto): SearchResultDto<CreditAndDebitAnalysisSearchDto>
    fun save(analysisList: Array<TollTicketAnalysisSearchDto>)
    fun save(analysisList: Array<CreditAndDebitAnalysisSearchDto>)
    fun remove(analysisList: Array<TollTicketAnalysisSearchDto>)
    fun remove(analysisList: Array<CreditAndDebitAnalysisSearchDto>)
}