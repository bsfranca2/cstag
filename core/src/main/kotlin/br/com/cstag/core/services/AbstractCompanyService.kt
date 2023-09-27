package br.com.cstag.core.services

import br.com.cstag.core.entities.AbstractCompany
import br.com.cstag.core.entities.Company
import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.entities.Tenant
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.AbstractCompanyRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional
import kotlin.math.abs

@Service
class AbstractCompanyService(
    private val abstractCompanyRepository: AbstractCompanyRepository
) {
    fun findByCNPJ(cnpj: CNPJ): AbstractCompany {
        return abstractCompanyRepository.findByIdOrNull(cnpj)
            ?: throw NotFoundException("Empresa $cnpj não encontrada")
    }

    @Transactional
    fun create(
        tenant: Tenant,
        cnpj: CNPJ,
        companyName: String,
        headquarter: AbstractCompany?,
        type: AbstractCompany.Type
    ): AbstractCompany {
        val abstractCompany = when(type) {
            AbstractCompany.Type.Company -> Company(tenant, cnpj, companyName)
            AbstractCompany.Type.ShippingCompany -> ShippingCompany(tenant, cnpj, companyName)
        }
        headquarter?.let {
            abstractCompany.headquarter = it
        }
        return save(abstractCompany)
    }

    fun create(
        tenant: Tenant,
        cnpj: CNPJ,
        companyName: String,
        headquarterCNPJ: CNPJ?,
        type: AbstractCompany.Type
    ): AbstractCompany {
        val headquarter = try {
            findByCNPJ(cnpj)
        } catch (e: Exception) {
            null
        }
        return create(tenant, cnpj, companyName, headquarter, type)
    }

    @Transactional
    fun save(company: AbstractCompany): AbstractCompany {
        return abstractCompanyRepository.save(company)
    }
}