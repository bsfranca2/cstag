package br.com.cstag.core.entities.semparar

import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity(name = "TollValleyTicketSemParar")
@DiscriminatorValue("TollValleyTicketSemParar")
class TollValleyTicketSemParar(
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
    var trip: String? = null
    var shipperName: String? = null
    @Embedded
    @AttributeOverride(name = "value", column = Column(name = "shipper_cnpj"))
    var shipperCNPJ: CNPJ? = null
    override var type = Type.TollValleyTicket

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
