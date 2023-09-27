package br.com.cstag.api.dto

import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.entities.TollValleyCredit
import java.math.BigDecimal
import java.time.LocalDateTime

data class CreditAndDebitDetailsDto(
    val shippingCompanyCNPJ: String,
    val trip: String,
    val id: Long,
    var differenceOfValue: BigDecimal,
    var totalOfCredit: BigDecimal,
    var totalOfDebit: BigDecimal,
    var numberOfTransactions: Int,
    var licensePlate: String?,
    var startOfPeriod: LocalDateTime?,
    var endOfPeriod: LocalDateTime?,
    var divergence: String?,
    var creditList: List<TollValleyCreditDto>,
    var ticketList: List<TicketDto>
)

fun CreditAndDebitAnalysis.toCreditAndDebitDetailsDto() =
    CreditAndDebitDetailsDto(
        shippingCompanyCNPJ = shippingCompany.cnpj.value,
        trip = trip,
        id = id,
        differenceOfValue = differenceOfValue,
        totalOfCredit = totalOfCredit,
        totalOfDebit = totalOfDebit,
        numberOfTransactions = numberOfTransactions,
        licensePlate = licensePlate?.value,
        startOfPeriod = startOfPeriod,
        endOfPeriod = endOfPeriod,
        divergence = divergence?.toString(),
        creditList = creditList.map { it.toTollValleyCreditDto() },
        ticketList = ticketList.map { it.toTicketDto() },
    )