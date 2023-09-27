package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollValleyCredit
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface TollValleyCreditRepository : CrudRepository<TollValleyCredit, Long> {
    fun findByInvoice_ShippingCompany_CnpjAndStatusIsNot(
        shippingCompanyCNPJ: CNPJ,
        status: TollRegistryStatus
    ): MutableList<TollValleyCredit>
}