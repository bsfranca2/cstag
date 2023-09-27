package br.com.cstag.core.entities

import java.io.Serializable
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "vehicles")
data class Vehicle(
    @EmbeddedId
    @AttributeOverride(name = "value", column = Column(name = "license_plate"))
    val licensePlate: LicensePlate,
) {
    var brand: String? = null
    var description: String? = null
    var model: String? = null
    var year: Int? = null

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "vehicle", orphanRemoval = true)
    var axlesRegistries: MutableList<AxlesRegistry> = mutableListOf()

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "vehicle", orphanRemoval = true)
    var clientRegistries: MutableList<ClientRegistry> = mutableListOf()

    fun getAxlesRegistry(date: LocalDateTime): AxlesRegistry? {
        axlesRegistries.forEach {
            val start = it.period.startAt
            val end = it.period.endAt
            if ((start.isBefore(date) || start.isEqual(date)) && (end == null || end.isAfter(date) || end.isEqual(date))) {
                return it
            }
        }
        return null
    }

    @Entity
    @Table(name = "axles_registries")
    data class AxlesRegistry(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1,
        val total: Int,
        val suspended: Int,
        val period: LocalDateTimeRange
    ) {
        @ManyToOne(cascade = [CascadeType.DETACH])
        @JoinColumn(name = "vehicle_id")
        lateinit var vehicle: Vehicle
    }

    @Entity
    @Table(name = "client_registries")
    data class ClientRegistry(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1,
        val segment: String?,
        val client: String?,
        @Column(name = "client_group")
        val group: String?,
        val subgroup: String?,
        val period: LocalDateTimeRange
    ) {
        @ManyToOne(cascade = [CascadeType.DETACH])
        @JoinColumn(name = "vehicle_id")
        lateinit var vehicle: Vehicle
    }
}

@Embeddable
data class LicensePlate(
    var value: String
) : Serializable {
    override fun toString(): String {
        return value
    }
}