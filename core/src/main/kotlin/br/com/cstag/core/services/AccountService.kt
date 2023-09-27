package br.com.cstag.core.services

import br.com.cstag.core.entities.Account
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.AccountRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
    private val companyService: CompanyService
) {
    fun findAccountByCNPJ(cnpj: CNPJ): Account {
        return accountRepository.findByIdOrNull(cnpj)
            ?: throw NotFoundException("Conta ${cnpj} não encontrada")
    }

    fun findAll(): List<Account> {
        return accountRepository.findAll().toList()
    }

    @Transactional
    fun create(account: Account, headquarterCNPJ: CNPJ?): Account {
        val accountSaved = accountRepository.save(account)
        headquarterCNPJ?.runCatching {
            val headquarter = companyService.findByCNPJ(this)
            accountSaved.company.headquarter = headquarter
            companyService.save(accountSaved.company)
        }
        return accountSaved
    }

    fun changePassword(accountCNPJ: CNPJ, newPassword: String): Account {
        val account = findAccountByCNPJ(accountCNPJ)
        return changePassword(account, newPassword)
    }

    @Transactional
    fun changePassword(account: Account, newPassword: String): Account {
        return accountRepository.save(account.copy(password = newPassword))
    }

    @Transactional
    fun save(account: Account): Account {
        return accountRepository.save(account)
    }
}