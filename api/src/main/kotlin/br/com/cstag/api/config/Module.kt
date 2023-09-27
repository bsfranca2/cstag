package br.com.cstag.api.config

import br.com.cstag.adapters.excel.poi.ExcelGatewayImp
import br.com.cstag.adapters.searchengine.meili.SearchEngineGatewayImp
import br.com.cstag.adapters.storage.b2.StorageGatewayImp
import br.com.cstag.adapters.token.jwt.TokenGatewayImp
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct

@Configuration
@ComponentScan(basePackages = [
    "br.com.cstag.core.config",
    "br.com.cstag.api.security",
    "br.com.cstag.api.controllers",
    "br.com.cstag.adapters.messagebroker.rabbit"
])
class Module {
    @Bean
    fun tokenGatewayImp() = TokenGatewayImp()

    @Bean
    fun storageGatewayImp() = StorageGatewayImp()

    @Bean
    fun excelGateway() = ExcelGatewayImp()

    @Bean
    fun searchEngineGateway() = SearchEngineGatewayImp()

    @PostConstruct
    fun logVersion() {
        val version = "2"
        println("==============[Versão $version]====================")
    }
}