package br.com.cstag.api.controllers

import br.com.cstag.api.dto.MonthlyPaymentDto
import br.com.cstag.api.security.GetAccountLoggedContextService
import br.com.cstag.core.services.semparar.MonthlyPaymentService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/monthly-payments")
class MonthlyPaymentController {
    @Autowired
    lateinit var monthlyPaymentService: MonthlyPaymentService
    @Autowired
    lateinit var getAccountLoggedContextService: GetAccountLoggedContextService

    @GetMapping("/{year}")
    fun getByYear(@PathVariable year: Int): List<MonthlyPaymentDto> {
        val cnpj = getAccountLoggedContextService.getAccountCNPJ()
        val list = monthlyPaymentService.findByYear(CNPJ(cnpj), year)
        val group: MutableMap<String, MonthlyPaymentDto> = mutableMapOf()
        list.forEach {
            val licensePlate = it.licensePlate
            val category = it.cat
            if (licensePlate == null || category == null)
                return@forEach
            val item = group[it.licensePlate] ?: MonthlyPaymentDto(licensePlate, category)
            when(it.month) {
                1 -> item.january = it.value
                2 -> item.february = it.value
                3 -> item.march = it.value
                4 -> item.april = it.value
                5 -> item.may = it.value
                6 -> item.june = it.value
                7 -> item.july = it.value
                8 -> item.august = it.value
                9 -> item.september = it.value
                10 -> item.october = it.value
                11 -> item.november = it.value
                12 -> item.december = it.value
                else -> println("Mês não conhecido: " + it.month)
            }
            group[licensePlate] = item
        }
        return group.map { it.value }.sortedBy { it.licensePlate }.sortedBy { it.category }
    }
}