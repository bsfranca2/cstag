package br.com.cstag.core.repositories

import br.com.cstag.core.entities.MonthlyPayment
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface MonthlyPaymentRepository : CrudRepository<MonthlyPayment, Long> {
    fun findByInvoice_ShippingCompany_CnpjAndYear(shippingCompanyCNPJ: CNPJ, year: Int): MutableList<MonthlyPayment>
}