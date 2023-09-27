package br.com.cstag.core.entities

import br.com.cstag.core.valueobjects.CNPJ
import javax.persistence.*

@Entity
@Table(name = "shipping_companies")
@DiscriminatorValue("SHIPPING_COMPANY")
class ShippingCompany(
    cnpj: CNPJ,
    companyName: String,
) : AbstractCompany(cnpj, companyName) {
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    val vehicles = mutableListOf<Vehicle>()

    fun addVehicle(vehicle: Vehicle) {
        this.vehicles.add(vehicle)
    }
}