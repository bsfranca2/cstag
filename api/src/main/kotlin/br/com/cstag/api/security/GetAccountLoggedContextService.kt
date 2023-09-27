package br.com.cstag.api.security

import br.com.cstag.api.dto.AccountDto
import br.com.cstag.api.dto.TokenDto
import br.com.cstag.api.dto.toAccountDto
import br.com.cstag.api.dto.toToken
import br.com.cstag.core.services.AccountService
import br.com.cstag.core.services.AuthService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class GetAccountLoggedContextService {
    @Autowired
    lateinit var accountService: AccountService
    @Autowired
    lateinit var authService: AuthService

    fun getAccountContext(token: TokenDto): AccountDto {
        return authService.getLoggedContext(token.toToken()).toAccountDto()
    }

    fun findAccountByCNPJ(cnpj: String): AccountDto {
        return accountService.findAccountByCNPJ(CNPJ(cnpj)).toAccountDto()
    }

    fun getAuthenticationContext(): Authentication {
        val ctx = SecurityContextHolder.getContext()
        return ctx.authentication
    }

    fun getAccountCNPJ(): String {
        return getAuthenticationContext().name
    }
}