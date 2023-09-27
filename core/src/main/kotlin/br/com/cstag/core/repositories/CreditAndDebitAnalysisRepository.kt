package br.com.cstag.core.repositories

import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.entities.ShippingCompany
import org.springframework.data.repository.CrudRepository

interface CreditAndDebitAnalysisRepository : CrudRepository<CreditAndDebitAnalysis, Long> {
    fun findByTripAndShippingCompany(trip: String?, shippingCompany: ShippingCompany?): CreditAndDebitAnalysis?
    fun findByShippingCompanyAndTripIn(shippingCompany: ShippingCompany, trip: MutableCollection<String>): MutableList<CreditAndDebitAnalysis>
}