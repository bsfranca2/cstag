package br.com.cstag.core.entities

import br.com.cstag.core.exceptions.CompanyNotValidException
import br.com.cstag.core.valueobjects.CNPJ
import javax.persistence.*

@Entity
@Table(name = "abstract_companies")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorValue("COMPANY_ABSTRACT")
abstract class AbstractCompany(
    @EmbeddedId
    @AttributeOverride(name = "value", column = Column(name = "cnpj"))
    open var cnpj: CNPJ,
    open var companyName: String,
) {
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "headquarter_id")
    open var headquarter: AbstractCompany? = null

    @OneToMany(cascade = [CascadeType.DETACH], mappedBy = "headquarter")
    open var branches: MutableList<AbstractCompany> = mutableListOf()

    private fun isShippingCompany(): Boolean {
        return this is ShippingCompany
    }

    fun getShippingCompany(): ShippingCompany {
        if (isShippingCompany())
            return this as ShippingCompany
        throw CompanyNotValidException("Empresa invalida, não é uma transportadora")
    }
}