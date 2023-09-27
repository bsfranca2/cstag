package br.com.cstag.core.entities

import br.com.cstag.core.enums.Role
import br.com.cstag.core.valueobjects.CNPJ
import javax.persistence.*

@Entity
@Table(name = "accounts")
data class Account(
    @EmbeddedId
    @AttributeOverride(name = "value", column = Column(name = "id"))
    var id: CNPJ,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "company_abstract_cnpj")
    val company: AbstractCompany,
    val password: String,
    @Enumerated(EnumType.STRING)
    val role: Role
)