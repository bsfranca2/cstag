package br.com.cstag.core.services.vehicle

import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.LocalDateTimeRange
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.services.AbstractCompanyService
import org.springframework.stereotype.Service
import java.io.File
import javax.transaction.Transactional

@Service
class ImportVehicleService(
    private val excelGateway: ExcelGateway,
    private val abstractCompanyService: AbstractCompanyService
) {
    @Transactional
    fun importSheet(account: Account, period: LocalDateTimeRange, sheetFile: File) {
        val company = account.company.getShippingCompany()
        val dataExtraction = VehicleDataExtraction(period, excelGateway)
        val data = dataExtraction.extract(sheetFile)
        company.vehicles.addAll(data)
        abstractCompanyService.save(company)
    }
}