package br.com.cstag.core.services.analyze.utils

import br.com.cstag.core.exceptions.NotFoundException

object RoadCodeRetriever {
    private const val federalAcronym = "BR"
    private val statesAcronyms =
        listOf("AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO")

    fun retrieve(road: String): RoadCode {
        val roadUpperCase = road.trim().toUpperCase()
        if (roadUpperCase.startsWith(federalAcronym)) {
            return RoadCode(
                acronym = federalAcronym,
                number = getRoadCode(federalAcronym, roadUpperCase),
                source = road
            )
        }
        statesAcronyms.forEach {
            if (roadUpperCase.startsWith(it)) {
                return RoadCode(
                    acronym = it,
                    number = getRoadCode(it, roadUpperCase),
                    source = road
                )
            }
        }
        throw NotFoundException("Número da rodovia não entrado em $road")
    }

    private fun getRoadCode(word: String, road: String): String {
        return WordFollowedByNumberRetriever.retrieve(word, road)
    }

    data class RoadCode(
        val acronym: String,
        val number: String,
        val source: String
    ) {
        fun isSame(roadCode: RoadCode): Boolean {
            return roadCode.acronym == acronym && roadCode.number == number
        }
    }
}