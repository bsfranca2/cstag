package br.com.cstag.core.services

import br.com.cstag.core.entities.MonthlyPayment
import br.com.cstag.core.repositories.MonthlyPaymentRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.stereotype.Service

@Service
class MonthlyPaymentService(
    private val monthlyPaymentRepository: MonthlyPaymentRepository
) {
    fun findByYear(accountCNPJ: CNPJ, year: Int): MutableList<MonthlyPayment> {
        return monthlyPaymentRepository.findByInvoice_ShippingCompany_CnpjAndYear(accountCNPJ, year)
    }
}