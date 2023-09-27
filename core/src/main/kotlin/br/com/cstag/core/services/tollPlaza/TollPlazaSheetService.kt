package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.constants.MessageBrokerConstant
import br.com.cstag.core.dto.TollPlazaMessageDto
import br.com.cstag.core.entities.LocalDateRange
import br.com.cstag.core.entities.TollPlazaPeriod
import br.com.cstag.core.enums.ImportStatus
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.MessageBrokerGateway
import br.com.cstag.core.gateways.StorageGateway
import br.com.cstag.core.repositories.TollPlazaPeriodRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.io.File
import java.util.*
import javax.transaction.Transactional

@Service
class TollPlazaSheetService(
    private val tollPlazaService: TollPlazaService,
    private val storageGateway: StorageGateway,
    private val messageBrokerGateway: MessageBrokerGateway,
    private val excelGateway: ExcelGateway
) {
    companion object {
        private val BUCKET_NAME = System.getenv("BUCKET_NAME")
        private val logger = LoggerFactory.getLogger(this::class.java)
    }

    @Transactional
    fun uploadSheet(sheetFile: File, period: LocalDateRange) {
        val tollPlazaPeriod = tollPlazaService.save(TollPlazaPeriod(period.startAt, period.endAt))
        kotlin.runCatching {
            val bucketName = BUCKET_NAME
            val objectName = UUID.randomUUID().toString() + ".xlsx"
            storageGateway.putObject(bucketName, objectName, sheetFile)
            val exchange = MessageBrokerConstant.IMPORT_EXCHANGE
            val routingKey = MessageBrokerConstant.IMPORT_TOLL_PLAZA_SHEET_KEY
            val message = TollPlazaMessageDto(bucketName, objectName, tollPlazaPeriod.id)
            val clazz = TollPlazaMessageDto::class.java
            messageBrokerGateway.sendToExchange(exchange, routingKey, message, clazz)
        }.onFailure {
            logger.error(it.message ?: it.localizedMessage)
            tollPlazaPeriod.status = ImportStatus.Error
            tollPlazaService.save(tollPlazaPeriod)
        }
    }

    @Transactional
    fun importSheet(dto: TollPlazaMessageDto) {
        val tollPlazaPeriod = tollPlazaService.findPeriodById(dto.tollPlazaPeriodId)
        kotlin.runCatching {
            val sheetFile = storageGateway.getObject(dto.bucketName, dto.objectName)
            val dataExtraction = TollPlazaDataExtraction(excelGateway)
            val tollPlazaList = dataExtraction.extract(sheetFile)
            tollPlazaList.forEach { it.period = tollPlazaPeriod }
            tollPlazaPeriod.tollPlazaList.addAll(tollPlazaList)
            tollPlazaPeriod.status = ImportStatus.Done
            tollPlazaService.save(tollPlazaPeriod)
        }.onFailure {
            logger.error(it.message ?: it.localizedMessage)
            tollPlazaPeriod.status = ImportStatus.Error
            tollPlazaService.save(tollPlazaPeriod)
        }
    }
}