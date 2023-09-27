package br.com.cstag.core.repositories

import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface InvoiceRepository : CrudRepository<Invoice, Long> {
    fun findByShippingCompany_Cnpj(shippingCompanyCnpj: CNPJ): MutableList<Invoice>
}