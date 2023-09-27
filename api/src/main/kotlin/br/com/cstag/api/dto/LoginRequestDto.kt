package br.com.cstag.api.dto

data class LoginRequestDto(
    val cnpj: String,
    val password: String
)