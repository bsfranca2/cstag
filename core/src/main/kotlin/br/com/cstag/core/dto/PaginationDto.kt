package br.com.cstag.core.dto

class PaginationDto <T>(
    val page: Int,
    val perPage: Int,
    val total: Long,
    val list: List<T>
)