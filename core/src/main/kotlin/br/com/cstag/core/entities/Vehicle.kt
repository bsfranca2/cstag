package br.com.cstag.core.entities

import br.com.cstag.core.valueobjects.LicensePlate
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity(name = "Vehicle")
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

    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    var axlesRegistries: MutableList<AxlesRegistry> = mutableListOf()

    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    var clientRegistries: MutableList<ClientRegistry> = mutableListOf()

    fun getAxlesRegistry(date: LocalDateTime): AxlesRegistry? {
        axlesRegistries.forEach {
            val start = it.period.startAt.atOffset(ZoneOffset.UTC).toLocalDateTime()
            val end = it.period.endAt?.atOffset(ZoneOffset.UTC)?.toLocalDateTime()
            if ((start.isBefore(date) || start.isEqual(date)) && (end == null || end.isAfter(date) || end.isEqual(date))) {
                return it
            }
        }
        return null
    }

    @Entity(name = "AxlesRegistry")
    @Table(name = "axles_registries")
    data class AxlesRegistry(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1,
        val total: Int,
        val suspended: Int,
        val period: InstantRange
    )

    @Entity(name = "ClientRegistry")
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
        val period: InstantRange
    )
}