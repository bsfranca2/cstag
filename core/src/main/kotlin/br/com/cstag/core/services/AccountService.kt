package br.com.cstag.core.services

import br.com.cstag.core.entities.AbstractCompany
import br.com.cstag.core.entities.Account
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.exceptions.ValidationException
import br.com.cstag.core.repositories.AccountRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
) {
    fun findAccountByCNPJ(cnpj: CNPJ): Account {
        return accountRepository.findByIdOrNull(cnpj)
            ?: throw NotFoundException("Conta $cnpj não encontrada")
    }

    fun findAccountByUsername(username: String): Account {
        return accountRepository.findByUsername(username)
            ?: throw NotFoundException("Conta com o usuário $username não encontrada")
    }

    fun findAll(): List<Account> {
        return accountRepository.findAll().toList()
    }

    @Transactional
    fun create(abstractCompany: AbstractCompany, username: String, password: String, role: Account.Role): Account {
        kotlin.runCatching {
            findAccountByCNPJ(abstractCompany.cnpj)
            findAccountByUsername(username)
        }.onSuccess {
            throw ValidationException("Empresa ${abstractCompany.cnpj} ja tem uma conta existente")
        }
        val account = Account(abstractCompany, username, password, role)
        return save(account)
    }

    @Transactional
    fun save(account: Account): Account {
        return accountRepository.save(account)
    }

    @Transactional
    fun changePassword(account: Account, newPassword: String): Account {
        return save(account.copy(password = newPassword))
    }

    fun changePassword(accountCNPJ: CNPJ, newPassword: String): Account {
        val account = findAccountByCNPJ(accountCNPJ)
        return changePassword(account, newPassword)
    }

    fun headquartersAvailable(): List<Account> {
        val accounts = findAll()
        return accounts.filter { it.company.isShippingCompany() &&  !it.company.hasHeadquarter() }
    }
}