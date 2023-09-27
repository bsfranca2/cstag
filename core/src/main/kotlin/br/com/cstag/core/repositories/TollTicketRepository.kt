package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface TollTicketRepository : CrudRepository<TollTicket, Long> {
    fun findByInvoice_ShippingCompany_CnpjAndTypeAndStatusIsNot(
        shippingCompanyCNPJ: CNPJ,
        type: TollTicket.Type,
        status: TollRegistryStatus
    ): MutableList<TollTicket>
}