package br.com.cstag.core.services

import br.com.cstag.core.dto.*
import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.gateways.SearchEngineGateway
import br.com.cstag.core.repositories.CreditAndDebitAnalysisRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class AnalyzeSearchService(
    private val searchEngineGateway: SearchEngineGateway,
) {
    fun search(dto: TollTicketAnalysisFilterDto, paginate: PaginateDto): SearchResultDto<TollTicketAnalysisSearchDto> {
        return searchEngineGateway.search(dto, paginate)
    }

    fun search(
        dto: CreditAndDebitAnalysisFilterDto,
        paginate: PaginateDto
    ): SearchResultDto<CreditAndDebitAnalysisSearchDto> {
        return searchEngineGateway.search(dto, paginate)
    }
}