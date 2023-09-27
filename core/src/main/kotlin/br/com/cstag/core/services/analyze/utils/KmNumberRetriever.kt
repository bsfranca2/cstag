package br.com.cstag.core.services.analyze.utils

import br.com.cstag.core.exceptions.NotFoundException

object KmNumberRetriever {
    fun retrieve(highway: String): String {
        if (!highway.toLowerCase().contains("km"))
            throw NotFoundException("Palavra KM não encontrada em $highway")
        return WordFollowedByNumberRetriever.retrieve("km", highway)
    }
}