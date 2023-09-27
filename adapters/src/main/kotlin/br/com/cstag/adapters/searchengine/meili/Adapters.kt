package br.com.cstag.adapters.searchengine.meili

import br.com.cstag.core.dto.CreditAndDebitAnalysisFilterDto
import br.com.cstag.core.dto.PaginateDto
import br.com.cstag.core.dto.TollTicketAnalysisFilterDto
import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.entities.CreditAndDebitAnalysisDivergence
import br.com.cstag.core.entities.TollTicketAnalysisDivergence

fun TollTicketAnalysisFilterDto.toFilterDto(): FilterDto {
    val builder = FiltersBuilder()
        .andIfIsNotNull("licensePlate", this.licensePlate)
        .andIfIsNotNull("invoiceNumber", this.invoiceNumber)
        .andIfIsNotNull("operatorCompany", this.operatorCompany)
        .andIfIsNotNull("tollTicketType", this.tollTicketType)
        .andIfIsNotNull("shippingCompanyCNPJ", this.shippingCompanyCNPJ)

    when(this.type) {
        "Positive/Negative" -> {
            builder.and(FiltersBuilder()
                .or("type", TollTicketAnalysisDivergence.Type.Positive.toString())
                .or("type", TollTicketAnalysisDivergence.Type.Negative.toString())
            )
        }
        "Without" -> {
            builder.andNot(FiltersBuilder()
                .or("type", TollTicketAnalysisDivergence.Type.Positive.toString())
                .or("type", TollTicketAnalysisDivergence.Type.Negative.toString())
            )
        }
        else -> {
            builder.andIfIsNotNull("type", this.type)
        }
    }

    this.startOfPeriod?.let { builder.andGreaterOrEqualThan("paidAt", it) }
    this.endOfPeriod?.let { builder.andLessOrEqualThan("paidAt", it) }
    val filtersBuilt = builder.build()
    println(filtersBuilt)
    return FilterDto().apply {
        q = this@toFilterDto.q
        if (filtersBuilt.trim() != "") {
            filters = builder.build()
        }
    }
}

fun TollTicketAnalysisFilterDto.toFilterDto(paginateDto: PaginateDto): FilterDto {
    val filterDto = this.toFilterDto()
    val (perPage, page) = paginateDto
    filterDto.limit = perPage
    if (perPage != null  && page != null) {
        filterDto.offset = perPage * (page - 1)
    }
    return filterDto
}

fun CreditAndDebitAnalysisFilterDto.toFilterDto(): FilterDto {
    val builder = FiltersBuilder()
        .andIfIsNotNull("licensePlate", this.licensePlate)
        .andIfIsNotNull("shippingCompanyCNPJ", this.shippingCompanyCNPJ)
        .andIfIsNotNull("trip", this.trip)

    when(this.type) {
        "Credit/Debit" -> {
            builder.and(FiltersBuilder()
                .or("divergenceType", CreditAndDebitAnalysisDivergence.Type.Credit.toString())
                .or("divergenceType", CreditAndDebitAnalysisDivergence.Type.Debit.toString())
            )
        }
        "Without" -> {
            builder.andNot(FiltersBuilder()
                .or("divergenceType", CreditAndDebitAnalysisDivergence.Type.Credit.toString())
                .or("divergenceType", CreditAndDebitAnalysisDivergence.Type.Debit.toString())
            )
        }
        else -> {
            builder.andIfIsNotNull("divergenceType", this.type)
        }
    }

    this.startOfPeriod?.let { builder.andGreaterOrEqualThan("startOfPeriod", it) }
    this.endOfPeriod?.let { builder.andLessOrEqualThan("endOfPeriod", it) }
    val filtersBuilt = builder.build()
    println(filtersBuilt)
    return FilterDto().apply {
        q = this@toFilterDto.q
        if (filtersBuilt.trim() != "") {
            filters = builder.build()
        }
    }
}
fun CreditAndDebitAnalysisFilterDto.toFilterDto(paginateDto: PaginateDto): FilterDto {
    val filterDto = this.toFilterDto()
    val (perPage, page) = paginateDto
    filterDto.limit = perPage
    if (perPage != null  && page != null) {
        filterDto.offset = perPage * (page - 1)
    }
    return filterDto
}