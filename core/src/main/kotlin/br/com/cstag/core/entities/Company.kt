package br.com.cstag.core.entities

import br.com.cstag.core.exceptions.CompanyInvalidException
import br.com.cstag.core.valueobjects.CNPJ
import java.io.Serializable
import javax.persistence.*

@Entity
@Table(name = "abstract_companies")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorValue("COMPANY_ABSTRACT")
@IdClass(AbstractCompanyId::class)
abstract class AbstractCompany(
    @Id
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "tenant_id")
    open var tenant: Tenant,
    @Id
    @AttributeOverride(name = "value", column = Column(name = "cnpj"))
    open var cnpj: CNPJ,
    open var companyName: String,
) {
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "headquarter_id")
    open var headquarter: AbstractCompany? = null

    @OneToMany(cascade = [CascadeType.DETACH], mappedBy = "headquarter")
    open var branches: MutableList<AbstractCompany> = mutableListOf()

    fun hasHeadquarter(): Boolean {
        return headquarter != null
    }

    fun isShippingCompany(): Boolean {
        return this is ShippingCompany
    }

    fun getShippingCompany(): ShippingCompany {
        if (isShippingCompany())
            return this as ShippingCompany
        throw CompanyInvalidException("Empresa invalida, não é uma transportadora.")
    }

    enum class Type {
        Company, ShippingCompany
    }
}

data class AbstractCompanyId(
    val tenant: Tenant,
    val cnpj: CNPJ
) : Serializable

findById(Long)
findById(AbstractCompanyId)

@Entity
@Table(name = "companies")
@DiscriminatorValue("COMPANY")
class Company(
    tenant: Tenant,
    cnpj: CNPJ,
    companyName: String,
) : AbstractCompany(tenant, cnpj, companyName)

@Entity
@Table(name = "shipping_companies")
@DiscriminatorValue("SHIPPING_COMPANY")
class ShippingCompany(
    tenant: Tenant,
    cnpj: CNPJ,
    companyName: String,
) : AbstractCompany(tenant, cnpj, companyName) {
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    val vehicles = mutableListOf<Vehicle>()
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    val trailers = mutableListOf<Trailer>()

    fun addVehicle(vehicle: Vehicle) {
        this.vehicles.add(vehicle)
    }

    fun addTrailer(trailer: Trailer) {
        this.trailers.add(trailer)
    }
}

