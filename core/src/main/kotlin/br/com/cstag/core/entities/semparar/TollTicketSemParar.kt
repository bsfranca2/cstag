package br.com.cstag.core.entities.semparar

import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.DiscriminatorValue
import javax.persistence.Entity
import javax.persistence.Table

@Entity(name = "TollTicketSemParar")
@Table(name = "toll_ticket_sem_parar")
@DiscriminatorValue("TollTicketSemParar")
class TollTicketSemParar(
    id: Long,
    highway: String,
    licensePlate: LicensePlate,
    category: Int,
    fare: BigDecimal,
    paidAt: LocalDateTime,
    status: TollRegistryStatus,
    operatorCompany: OperatorCompany
) : TollTicket(id, highway, licensePlate, category, fare, paidAt, status, operatorCompany) {
    var tag: String? = null
    var brand: String? = null

    constructor() : this(
        -1,
        "",
        LicensePlate(""),
        -1,
        BigDecimal("-1"),
        LocalDateTime.MAX,
        TollRegistryStatus.NotVerified,
        OperatorCompany.Undefined
    )
}
