package br.com.cstag.analyzes.config

import br.com.cstag.adapters.excel.poi.ExcelGatewayImp
import br.com.cstag.adapters.storage.b2.StorageGatewayImp
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan(basePackages = [
    "br.com.cstag.core.config.db",
    "br.com.cstag.core.config.service",
    "br.com.cstag.adapters.messagebroker.rabbit",
])
class Module {
    @Bean
    fun excelGateway() = ExcelGatewayImp()

    @Bean
    fun storageGateway() = StorageGatewayImp()
}