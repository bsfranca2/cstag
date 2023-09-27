package br.com.cstag.core.entities.semparar

import br.com.cstag.core.entities.TollValleyCredit
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity(name = "TollValleyCreditSemParar")
@Table(name = "toll_valley_credit_sem_parar")
@DiscriminatorValue("TollValleyCreditSemParar")
class TollValleyCreditSemParar(
    id: Long,
    licensePlate: LicensePlate,
    category: Int,
    value: BigDecimal,
    receivedAt: LocalDateTime,
    status: TollRegistryStatus,
    operatorCompany: OperatorCompany
) : TollValleyCredit(id, licensePlate, category, value, receivedAt, status, operatorCompany) {
    var tag: String? = null
    var description: String? = null
    var trip: String? = null
    var shipperName: String? = null
    @Embedded
    @AttributeOverride(name = "value", column = Column(name = "shipper_cnpj"))
    var shipperCNPJ: CNPJ? = null

    constructor() : this(
        -1,
        LicensePlate(""),
        -1,
        BigDecimal("-1"),
        LocalDateTime.MAX,
        TollRegistryStatus.NotVerified,
        OperatorCompany.Undefined
    )
}
