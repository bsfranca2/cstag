package br.com.cstag.api.dto

import br.com.cstag.core.entities.TollPlazaPeriod
import java.math.BigDecimal

class TollPlazaDto(
    val period: TollPlazaPeriodDto,
    val list: List<Item>
) {
    val id = period.id

    data class Item(
        var id: Long,
        var associateCompany: String,
        var category: Int,
        var value: BigDecimal,
        var fullRoadName: String,
        var source: String,
        var metadata: Map<String, String>
    )
}

fun TollPlazaPeriod.toTollPlazaDto() =
    TollPlazaDto(
        period = toTollPlazaPeriodDto(),
        list = tollPlazaList.map {
            TollPlazaDto.Item(
                it.id, it.associateCompany, it.category, it.value, it.fullRoadName, it.source.toString(), it.metadata.data
            )
        }
    )
