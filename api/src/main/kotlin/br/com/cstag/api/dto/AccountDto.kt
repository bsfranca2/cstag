package br.com.cstag.api.dto

import br.com.cstag.api.security.UserPrincipal
import br.com.cstag.core.entities.Account

data class AccountDto(
    val companyName: String,
    val companyCNPJ: String,
    val role: String,
    val headquarterCNPJ: String? = null,
    val headquarterName: String? = null
)

fun Account.toAccountDto() =
    AccountDto(
        companyName = company.companyName,
        companyCNPJ = company.cnpj.value,
        role = role.toString(),
        headquarterCNPJ = company.headquarter?.cnpj?.value,
        headquarterName = company.headquarter?.companyName,
    )

fun AccountDto.toUserPrincipal() =
    UserPrincipal(
        accountCNPJ = companyCNPJ,
        accountPassword = "",
        accountRole = role
    )