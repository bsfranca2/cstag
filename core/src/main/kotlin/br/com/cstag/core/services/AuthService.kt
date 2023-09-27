package br.com.cstag.core.services

import br.com.cstag.core.entities.Account
import br.com.cstag.core.exceptions.BadCredentialsException
import br.com.cstag.core.gateways.TokenGateway
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.Token
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

    fun authenticate(accountCNPJ: CNPJ, password: String): Token {
        val account = accountService.findAccountByCNPJ(accountCNPJ)
        if (password != account.password)
            throw BadCredentialsException("Senha não coincide")
        return tokenGateway.generate(account)
    }
}