package br.com.cstag.core.entities

import br.com.cstag.core.valueobjects.CNPJ
import javax.persistence.DiscriminatorValue
import javax.persistence.Entity
import javax.persistence.Table

@Entity
@Table(name = "companies")
@DiscriminatorValue("COMPANY")
class Company(
    cnpj: CNPJ,
    companyName: String,
) : AbstractCompany(cnpj, companyName)