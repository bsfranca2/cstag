package br.com.cstag.core.repositories.semparar

import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import org.springframework.data.repository.CrudRepository

interface TollValleyTicketSemPararRepository : CrudRepository<TollValleyTicketSemParar, Long> {
    fun findByTrip(trip: String): MutableList<TollValleyTicketSemParar>
}