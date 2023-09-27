package br.com.cstag.adapters.searchengine.meili

import br.com.cstag.adapters.messagebroker.rabbit.SerializationUtil
import br.com.cstag.core.dto.*
import br.com.cstag.core.gateways.SearchEngineGateway

class SearchEngineGatewayImp : SearchEngineGateway {
    companion object {
        private const val TOLL_PLAZA_VALUE = "toll_plaza_value"
        private const val CREDIT_DEBIT = "credit_debit"
    }

    val restClient = RestClient()

    override fun search(
        filter: TollTicketAnalysisFilterDto,
        paginateDto: PaginateDto
    ): SearchResultDto<TollTicketAnalysisSearchDto> {
        val filterDto = filter.toFilterDto(paginateDto)
        val json = SerializationUtil.serialize(filterDto, FilterDto::class.java)
        val data = restClient.search(TOLL_PLAZA_VALUE, json)
            ?: return SearchResultDto(0, 0, 0, listOf())
        val clazz = TollTicketAnalysisSearchResponseDto::class.java
        val result = SerializationUtil.deserialize(data, clazz)
        return SearchResultDto(result.offset, result.limit, result.nbHits, result.hits.toList())
    }

    override fun search(
        filter: CreditAndDebitAnalysisFilterDto,
        paginateDto: PaginateDto
    ): SearchResultDto<CreditAndDebitAnalysisSearchDto> {
        val filterDto = filter.toFilterDto(paginateDto)
        val json = SerializationUtil.serialize(filterDto, FilterDto::class.java)
        val data = restClient.search(CREDIT_DEBIT, json)
            ?: return SearchResultDto(0, 0, 0, listOf())
        val clazz = CreditAndDebitAnalysisSearchResponseDto::class.java
        val result = SerializationUtil.deserialize(data, clazz)
        return SearchResultDto(result.offset, result.limit, result.nbHits, result.hits.toList())
    }

    override fun save(analysisList: Array<TollTicketAnalysisSearchDto>) {
        val json = SerializationUtil.serialize(analysisList, Array<TollTicketAnalysisSearchDto>::class.java)
        restClient.save(TOLL_PLAZA_VALUE, json)
    }

    override fun save(analysisList: Array<CreditAndDebitAnalysisSearchDto>) {
        val json = SerializationUtil.serialize(analysisList, Array<CreditAndDebitAnalysisSearchDto>::class.java)
        restClient.save(CREDIT_DEBIT, json)
    }

    override fun remove(analysisList: Array<TollTicketAnalysisSearchDto>) {
        val data = analysisList.map { it.analysisId }.toTypedArray()
        val json = SerializationUtil.serialize(data, Array<Long>::class.java)
        restClient.remove(TOLL_PLAZA_VALUE, json)
    }

    override fun remove(analysisList: Array<CreditAndDebitAnalysisSearchDto>) {
        val data = analysisList.map { it.analysisId }.toTypedArray()
        val json = SerializationUtil.serialize(data, Array<Long>::class.java)
        restClient.remove(CREDIT_DEBIT, json)
    }
}