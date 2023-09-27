package br.com.cstag.api.dto

import br.com.cstag.core.entities.InstantRange
import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.valueobjects.LicensePlate
import java.time.Instant

data class VehicleDto(
    val licensePlate: String,
    val brand: String? = null,
    val description: String? = null,
    val model: String? = null,
    val year: Int? = null,
    val axlesRegistries: List<AxlesRegistry> = emptyList(),
    val clientRegistries: List<ClientRegistry> = emptyList()
) {
    data class AxlesRegistry(
        val id: Long = -1,
        val total: Int,
        val suspended: Int,
        val startOfPeriod: Instant,
        val endOfPeriod: Instant?
    )

    data class ClientRegistry(
        val id: Long = -1,
        val segment: String?,
        val client: String?,
        val group: String?,
        val subgroup: String?,
        val startOfPeriod: Instant,
        val endOfPeriod: Instant?
    )
}

fun Vehicle.toVehicleDto() =
    VehicleDto(
        licensePlate = licensePlate.value,
        brand = brand,
        description = description,
        model = model,
        year = year,
        axlesRegistries = axlesRegistries.map { it.toAxlesRegistryDto() },
        clientRegistries = clientRegistries.map { it.toClientRegistryDto() }
    )

fun VehicleDto.toVehicle() =
    Vehicle(
        licensePlate = LicensePlate(licensePlate),
    ).apply {
        brand = this@toVehicle.brand
        axlesRegistries.addAll(this@toVehicle.axlesRegistries.map { it.toAxlesRegistry() })
        clientRegistries.addAll(this@toVehicle.clientRegistries.map { it.toClientRegistry() })
        model = this@toVehicle.model
        year = this@toVehicle.year
        description = this@toVehicle.description
    }

fun Vehicle.AxlesRegistry.toAxlesRegistryDto() =
    VehicleDto.AxlesRegistry(
        id = id,
        total = total,
        suspended = suspended,
        startOfPeriod = period.startAt,
        endOfPeriod = period.endAt
    )

fun VehicleDto.AxlesRegistry.toAxlesRegistry() =
    Vehicle.AxlesRegistry(
        id, total, suspended, InstantRange(startOfPeriod, endOfPeriod)
    )

fun VehicleDto.ClientRegistry.toClientRegistry() =
    Vehicle.ClientRegistry(
        id, segment, client, group, subgroup, InstantRange(startOfPeriod, endOfPeriod)
    )

fun Vehicle.ClientRegistry.toClientRegistryDto() =
    VehicleDto.ClientRegistry(
        id, segment, client, group, subgroup, period.startAt, period.endAt
    )