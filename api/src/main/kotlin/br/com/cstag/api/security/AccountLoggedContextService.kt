package br.com.cstag.api.security

import br.com.cstag.api.dto.TokenDto
import br.com.cstag.api.dto.toToken
import br.com.cstag.api.services.AuthService
import br.com.cstag.core.entities.Account
import br.com.cstag.core.services.AccountService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AccountLoggedContextService {
    @Autowired
    private lateinit var accountService: AccountService
    @Autowired
    private lateinit var authService: AuthService

    fun getAccountContext(token: TokenDto): Account {
        return authService.getLoggedContext(token.toToken())
    }

    fun findAccountByCNPJ(cnpj: String): Account {
        return accountService.findAccountByCNPJ(CNPJ(cnpj))
    }

    fun getAuthenticationContext(): Authentication {
        val ctx = SecurityContextHolder.getContext()
        return ctx.authentication
    }

    fun getAccount(): Account {
        return accountService.findAccountByCNPJ(CNPJ(getAuthenticationContext().name))
    }

    fun getAccountCNPJ(): CNPJ {
        return getAccount().company.cnpj
    }
}