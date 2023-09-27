package br.com.cstag.core.dto

data class SearchResultDto <T>(
    var offset: Int,
    var limit: Int,
    var hits: Int,
    var list: List<T>
)