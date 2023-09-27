package br.com.cstag.api.dto

import br.com.cstag.core.entities.AbstractCompany
import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.Company
import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.valueobjects.CNPJ

data class CreateAccountDto(
    val companyCNPJ: String,
    val companyName: String,
    val username: String,
    val role: Account.Role,
    val password: String,
    val headquarterCNPJ: String? = null,
) {
    val companyType = when(role) {
        Account.Role.Client -> AbstractCompany.Type.ShippingCompany
        Account.Role.Admin -> AbstractCompany.Type.Company
    }
}
