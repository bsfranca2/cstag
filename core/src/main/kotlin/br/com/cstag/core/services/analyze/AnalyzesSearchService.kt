package br.com.cstag.core.services.analyze

import br.com.cstag.core.dto.CreditDebitAnalysisFilterDto
import br.com.cstag.core.dto.CreditDebitStatisticsDto
import br.com.cstag.core.dto.PaginationDto
import br.com.cstag.core.dto.TicketAnalysisFilterDto
import br.com.cstag.core.search.entities.CreditAndDebitAnalysisSearch
import br.com.cstag.core.search.entities.TicketAnalysisSearch
import org.elasticsearch.index.query.QueryBuilders
import org.elasticsearch.search.aggregations.Aggregation
import org.elasticsearch.search.aggregations.AggregationBuilders
import org.elasticsearch.search.aggregations.bucket.filter.ParsedFilter
import org.elasticsearch.search.aggregations.metrics.ParsedSum
import org.elasticsearch.search.sort.SortBuilders
import org.elasticsearch.search.sort.SortOrder
import org.springframework.data.domain.PageRequest
import org.springframework.data.elasticsearch.core.ElasticsearchOperations
import org.springframework.data.elasticsearch.core.SearchHits
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.ZoneId

@Service
class AnalyzesSearchService(
    private val elasticsearchRestTemplate: ElasticsearchOperations
) {
    fun search(dto: TicketAnalysisFilterDto, perPage: Int?, page: Int?): PaginationDto<TicketAnalysisSearch> {
        val query = QueryBuilders.boolQuery()

        dto.shippingCompanyCNPJ?.let {
            query.filter(QueryBuilders.termQuery("shippingCompany", it))
        }
        dto.invoiceNumber?.let {
            query.filter(QueryBuilders.termQuery("ticket.invoiceId", it))
        }
        dto.licensePlate?.let {
            query.filter(QueryBuilders.termQuery("ticket.licensePlate.keyword", it))
        }
        dto.divergence?.let {
            val fieldName = "divergenceType"
            when(it) {
                "With" -> query.filter(QueryBuilders.termsQuery(fieldName, "Neutral", "Positive", "Negative"))
                "Without" -> query.mustNot(QueryBuilders.existsQuery(fieldName))
                else -> query.filter(QueryBuilders.termQuery(fieldName, it))
            }
        }
        dto.startOfPeriod?.let { startOfPeriod ->
            dto.endOfPeriod?.let { endOfPeriod ->
                val start = startOfPeriod.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                val end = endOfPeriod.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                query.must(QueryBuilders.rangeQuery("ticket.paidAt").from(start).to(end))
            }
        }
        dto.term?.let {
            if (it.isNotEmpty()) {
                query.must(QueryBuilders.multiMatchQuery(it, "ticket.highway", "plaza.fullRoadName"))
            }
        }
        dto.operatorCompany?.let {
            query.filter(QueryBuilders.termQuery("ticket.operatorCompany.keyword", it))
        }
        dto.ticketType?.let {
            query.filter(QueryBuilders.termQuery("ticket.type.keyword", it))
        }

        val sort = SortBuilders.fieldSort("ticket.paidAt").order(SortOrder.DESC)
        val pageable = PageRequest.of(page ?: 0, perPage ?: 10)

        val build = NativeSearchQueryBuilder()
            .withQuery(query)
            .withSort(sort)
            .withPageable(pageable)
            .build()

        val result = elasticsearchRestTemplate.search(build, TicketAnalysisSearch::class.java)
        return PaginationDto(
            page = pageable.pageNumber,
            perPage = pageable.pageSize,
            total = result.totalHits,
            list = result.searchHits.map { it.content }
        )
    }

    fun search(
        dto: CreditDebitAnalysisFilterDto,
        perPage: Int? = null,
        page: Int? = null,
        statistics: Boolean = false
    ): SearchHits<CreditAndDebitAnalysisSearch> {
        val query = QueryBuilders.boolQuery()

        dto.shippingCompanyCNPJ?.let {
            query.filter(QueryBuilders.termQuery("shippingCompanyCNPJ", it))
        }
        dto.licensePlate?.let {
            query.filter(QueryBuilders.termQuery("licensePlate", it))
        }
        dto.trip?.let {
            query.filter(QueryBuilders.termQuery("trip", it))
        }
        dto.divergence?.let {
            val fieldName = "divergence"
            when(it) {
                "Credit/Debit" -> query.filter(QueryBuilders.termsQuery(fieldName, "Credit", "Debit"))
                "Without" -> query.mustNot(QueryBuilders.existsQuery(fieldName))
                else -> query.filter(QueryBuilders.termQuery(fieldName, it))
            }
        }
        /*dto.startOfPeriod?.let { startOfPeriod ->
            dto.endOfPeriod?.let { endOfPeriod ->
                val start = startOfPeriod.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                val end = endOfPeriod.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                query.must(QueryBuilders.rangeQuery("ticket.paidAt").from(start).to(end))
            }
        }*/

        val builder = NativeSearchQueryBuilder().withQuery(query)

        if (statistics) {
            val totalOfDebitAggregation = AggregationBuilders.sum("totalOfDebit").field("totalOfDebit")
            val totalOfCreditAggregation = AggregationBuilders.sum("totalOfCredit").field("totalOfCredit")
            builder.addAggregation(totalOfDebitAggregation).addAggregation(totalOfCreditAggregation)
        } else {
            val sort = SortBuilders.fieldSort("id").order(SortOrder.DESC)
            val pageable = PageRequest.of(page ?: 0, perPage ?: 10)
            builder.withSort(sort).withPageable(pageable)
        }

        val build = builder.build()
        return elasticsearchRestTemplate.search(build, CreditAndDebitAnalysisSearch::class.java)
    }

    fun searchPaginate(dto: CreditDebitAnalysisFilterDto, perPage: Int?, page: Int?): PaginationDto<CreditAndDebitAnalysisSearch> {
        val result = search(dto, perPage, page)
        return PaginationDto(
            page = page ?: 0,
            perPage = perPage ?: 10,
            total = result.totalHits,
            list = result.searchHits.map { it.content }
        )
    }

    fun statistics(dto: CreditDebitAnalysisFilterDto): CreditDebitStatisticsDto {
        val response = CreditDebitStatisticsDto()

        val result = search(dto = dto, statistics = true)
        result.aggregations?.let { aggregations ->
            aggregations.asMap["totalOfCredit"]?.let { response.totalOfCredit = getParsedSumValue(it) }
            aggregations.asMap["totalOfDebit"]?.let { response.totalOfDebit = getParsedSumValue(it) }
            response.numberOfAnalyzes = result.totalHits
        }

        return response
    }

    private fun getParsedSumValue(aggregation: Aggregation) =
        (aggregation as ParsedSum).value.toBigDecimal()
}