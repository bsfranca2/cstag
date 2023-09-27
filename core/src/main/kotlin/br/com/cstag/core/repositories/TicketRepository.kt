package br.com.cstag.core.repositories

import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.entities.Ticket
import org.springframework.data.repository.CrudRepository

interface TicketRepository : CrudRepository<Ticket, Long> {
    fun findByInvoice_ShippingCompanyAndTrip(shippingCompany: ShippingCompany, trip: String): MutableList<Ticket>
}