package br.com.cstag.api.dto

import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.Company
import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.enums.Role
import br.com.cstag.core.valueobjects.CNPJ

data class CreateAccountDto(
    val cnpj: String,
    val name: String,
    val role: String,
    val password: String,
    val headquarterCNPJ: String? = null,
)

fun CreateAccountDto.toAccount() =
    Account(
        id = CNPJ(cnpj),
        role = Role.valueOf(role),
        password = password,
        company = when(role) {
            "Admin" -> Company(CNPJ(cnpj), name)
            "Client" -> ShippingCompany(CNPJ(cnpj), name)
            else -> throw RuntimeException("Função não esperada")
        }
    )