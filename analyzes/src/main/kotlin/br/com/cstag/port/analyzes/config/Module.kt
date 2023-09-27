package br.com.cstag.port.analyzes.config

import br.com.cstag.adapters.excel.poi.ExcelGatewayImp
import br.com.cstag.adapters.searchengine.meili.SearchEngineGatewayImp
import br.com.cstag.adapters.storage.b2.StorageGatewayImp
import br.com.cstag.adapters.token.jwt.TokenGatewayImp
import br.com.cstag.core.gateways.SearchEngineGateway
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct

@Configuration
@ComponentScan(basePackages = [
    "br.com.cstag.core.config.db",
    "br.com.cstag.core.config.service",
    "br.com.cstag.adapters.messagebroker.rabbit",
])
class Module {
    @Bean
    fun tokenGatewayImp() = TokenGatewayImp()

    @Bean
    fun excelGateway() = ExcelGatewayImp()

    @Bean
    fun storageGateway() = StorageGatewayImp()

    @Bean
    fun searchEngineGateway() = SearchEngineGatewayImp()

    @PostConstruct
    fun logVersion() {
        val version = "2"
        println("==============[Versão $version]====================")
    }
}