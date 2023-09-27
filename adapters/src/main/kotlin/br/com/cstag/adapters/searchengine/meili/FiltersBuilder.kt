package br.com.cstag.adapters.searchengine.meili

import java.time.LocalDate
import java.time.ZoneId
import java.time.ZoneOffset

class FiltersBuilder {
    private var filters = ""

    private fun concatAnd(baseText: String): FiltersBuilder {
        filters = if (filters == "")
            baseText
        else
            """$filters AND $baseText """
        return this
    }

    private fun concatOr(baseText: String): FiltersBuilder {
        filters = if (filters == "")
            baseText
        else
            """$filters OR $baseText """
        return this
    }

    fun and(property: String, value: String): FiltersBuilder {
        val baseText = """$property = "$value" """
        concatAnd(baseText)
        return this
    }

    fun andIfIsNotNull(property: String, value: String?): FiltersBuilder {
        if (value == null || value.isEmpty()) return this
        return and(property, value)
    }

    fun and(property: String, value: Long): FiltersBuilder {
        val baseText = """$property = $value """
        concatAnd(baseText)
        return this
    }

    fun andIfIsNotNull(property: String, value: Long?): FiltersBuilder {
        if (value == null) return this
        return and(property, value)
    }

    fun and(filtersBuilder: FiltersBuilder): FiltersBuilder {
        val text = filtersBuilder.build()
        concatAnd(baseText = """($text) """)
        return this
    }

    fun andNot(filtersBuilder: FiltersBuilder): FiltersBuilder {
        val text = filtersBuilder.build()
        concatAnd(baseText = """(NOT ($text)) """)
        return this
    }

    fun andGreaterOrEqualThan(property: String, value: LocalDate): FiltersBuilder {
        val instant = value.atStartOfDay().toInstant(ZoneOffset.UTC).epochSecond
        val baseText = """$property >= $instant """
        concatAnd(baseText)
        return this
    }

    fun andLessOrEqualThan(property: String, value: LocalDate): FiltersBuilder {
        val instant = value.atStartOfDay().toInstant(ZoneOffset.UTC).epochSecond
        val baseText = """$property <= $instant """
        concatAnd(baseText)
        return this
    }

    fun or(property: String, value: String): FiltersBuilder {
        concatOr(baseText = """$property = $value """)
        return this
    }

    fun orIfIsNotNull(property: String, value: String?): FiltersBuilder {
        if (value == null) return this
        return or(property, value)
    }

    fun build(): String {
        return filters
    }
}
