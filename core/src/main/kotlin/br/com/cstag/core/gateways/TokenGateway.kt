package br.com.cstag.core.gateways

import br.com.cstag.core.entities.Account
import br.com.cstag.core.valueobjects.Token

interface TokenGateway {
    fun decode(token: Token): Map<String, String>
    fun generate(account: Account): Token
}