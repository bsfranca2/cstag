package br.com.cstag.core.repositories

import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.entities.TollValleyCredit
import org.springframework.data.repository.CrudRepository

interface TollValleyCreditRepository : CrudRepository<TollValleyCredit, Long> {
    fun findByInvoice_ShippingCompanyAndTrip(shippingCompany: ShippingCompany, trip: String): MutableList<TollValleyCredit>
}