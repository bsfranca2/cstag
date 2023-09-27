package br.com.cstag.core.repositories.semparar

import br.com.cstag.core.entities.semparar.TollValleyCreditSemParar
import org.springframework.data.repository.CrudRepository

interface TollValleyCreditSemPararRepository : CrudRepository<TollValleyCreditSemParar, Long> {
    fun findByTrip(trip: String): MutableList<TollValleyCreditSemParar>
}