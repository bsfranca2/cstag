package br.com.cstag.core.repositories.semparar

import br.com.cstag.core.entities.semparar.MonthlyPaymentSemParar
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface MonthlyPaymentRepository : CrudRepository<MonthlyPaymentSemParar, Long> {
    fun findByYearAndInvoice_ShippingCompany_Cnpj(year: Int, shippingCompanyCNPJ: CNPJ): MutableList<MonthlyPaymentSemParar>
}