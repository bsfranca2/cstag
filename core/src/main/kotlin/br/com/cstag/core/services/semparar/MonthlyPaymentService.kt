package br.com.cstag.core.services.semparar

import br.com.cstag.core.entities.semparar.MonthlyPaymentSemParar
import br.com.cstag.core.repositories.semparar.MonthlyPaymentRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.stereotype.Service

@Service
class MonthlyPaymentService(
    private val monthlyPaymentRepository: MonthlyPaymentRepository
) {
    fun findByYear(accountCNPJ: CNPJ, year: Int): MutableList<MonthlyPaymentSemParar> {
        return monthlyPaymentRepository.findByYearAndInvoice_ShippingCompany_Cnpj(year, accountCNPJ)
    }
}