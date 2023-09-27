package br.com.cstag.api.services

import br.com.cstag.api.exceptions.BadCredentialsException
import br.com.cstag.core.entities.Account
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.Token
import br.com.cstag.core.gateways.TokenGateway
import br.com.cstag.core.services.AccountService
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val accountService: AccountService,
    private val tokenGateway: TokenGateway
) {
    fun getLoggedContext(token: Token): Account {
        val tokenDecoded = tokenGateway.decode(token)
        val cnpj = CNPJ(tokenDecoded["companyCNPJ"]!!)
        return accountService.findAccountByCNPJ(cnpj)
    }

    fun authenticate(username: String, password: String): Token {
        val account = accountService.findAccountByUsername(username)
        if (password != account.password)
            throw BadCredentialsException("Senha não coincide")
        return tokenGateway.generate(account)
    }
}