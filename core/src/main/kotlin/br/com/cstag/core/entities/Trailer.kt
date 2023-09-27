package br.com.cstag.core.entities

import javax.persistence.*

@Entity
@Table(name = "trailers")
class Trailer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    var firstLicensePlate: String? = null
    var secondLicensePlate: String? = null
    var thirdLicensePlate: String? = null
    var kindOfEquipment: String? = null
    var model: String? = null
    var axlesSuspended: Int? = null
    var axlesTotal: Int? = null
}