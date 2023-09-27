package br.com.cstag.core.services

import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.TicketRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class TicketService(
    private val ticketRepository: TicketRepository
) {
    fun findById(id: Long): Ticket {
        return ticketRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Passagem $id não encontrada")
    }
}