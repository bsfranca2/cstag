package br.com.cstag.api.dto

import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.LocalDateTimeRange
import br.com.cstag.core.entities.Vehicle
import java.time.Instant
import java.time.ZoneId

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
        axlesRegistries.forEach { it.vehicle = this }
        clientRegistries.addAll(this@toVehicle.clientRegistries.map { it.toClientRegistry() })
        clientRegistries.forEach { it.vehicle = this }
        model = this@toVehicle.model
        year = this@toVehicle.year
        description = this@toVehicle.description
    }

fun Vehicle.AxlesRegistry.toAxlesRegistryDto() =
    VehicleDto.AxlesRegistry(
        id = id,
        total = total,
        suspended = suspended,
        startOfPeriod = period.startAt.atZone(ZoneId.systemDefault()).toInstant(),
        endOfPeriod = period.endAt?.atZone(ZoneId.systemDefault())?.toInstant(),
    )

fun VehicleDto.AxlesRegistry.toAxlesRegistry() =
    Vehicle.AxlesRegistry(
        id, total, suspended, LocalDateTimeRange(startOfPeriod, endOfPeriod)
    )

fun VehicleDto.ClientRegistry.toClientRegistry() =
    Vehicle.ClientRegistry(
        id, segment, client, group, subgroup, LocalDateTimeRange(startOfPeriod, endOfPeriod)
    )

fun Vehicle.ClientRegistry.toClientRegistryDto() =
    VehicleDto.ClientRegistry(
        id, segment, client, group, subgroup, period.startAt.atZone(ZoneId.systemDefault()).toInstant(), period.endAt?.atZone(ZoneId.systemDefault())?.toInstant()
    )