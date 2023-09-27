package br.com.cstag.core.services.trailer

import br.com.cstag.core.entities.Account
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.services.AbstractCompanyService
import org.springframework.stereotype.Service
import java.io.File

@Service
class ImportTrailerService(
    private val abstractCompanyService: AbstractCompanyService,
    private val excelGateway: ExcelGateway
) {
    fun import(account: Account, sheetFile: File) {
        val company = account.company.getShippingCompany()
        val dataExtraction = TrailerDataExtraction(excelGateway)
        val data = dataExtraction.extract(sheetFile)
        company.trailers.addAll(data)
        abstractCompanyService.save(company)
    }
}