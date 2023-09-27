package br.com.cstag.core.services

import br.com.cstag.core.entities.AbstractCompany
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.AbstractCompanyRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class CompanyService(
    private val abstractCompanyRepository: AbstractCompanyRepository
) {
    fun findByCNPJ(cnpj: CNPJ): AbstractCompany {
        return abstractCompanyRepository.findByIdOrNull(cnpj)
            ?: throw NotFoundException("Empresa $cnpj não encontrada")
    }
    @Transactional
    fun save(company: AbstractCompany): AbstractCompany {
        return abstractCompanyRepository.save(company)
    }
}