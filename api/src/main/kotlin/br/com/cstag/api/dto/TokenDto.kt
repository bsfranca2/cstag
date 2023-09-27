package br.com.cstag.api.dto

import br.com.cstag.core.valueobjects.Token

data class TokenDto(
    val token: String
)

fun Token.toTokenDto() =
    TokenDto(token = value)

fun TokenDto.toToken() =
    Token(value = token)