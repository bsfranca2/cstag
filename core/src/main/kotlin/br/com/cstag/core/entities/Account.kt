package br.com.cstag.core.entities

import br.com.cstag.core.valueobjects.CNPJ
import java.io.Serializable
import javax.persistence.*

@Entity
@Table(name = "accounts")
//@IdClass(AccountId::class)
data class Account(
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "company_abstract_cnpj", nullable = false, unique = true)
    val company: AbstractCompany,
    @Column(unique = true, nullable = false)
    val username: String,
    @Column(nullable = false)
    val password: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: Role
) {
//    @Id
//    @ManyToOne(cascade = [CascadeType.DETACH])
//    @JoinColumn(name = "tenant_id")
//    val tenant: Tenant = company.tenant
    @EmbeddedId
    @AttributeOverride(name = "value", column = Column(name = "id"))
    val id: CNPJ = company.cnpj

    enum class Role {
        Admin, Client
    }
}

data class AccountId(
    val tenant: Tenant,
    val id: CNPJ
) : Serializable