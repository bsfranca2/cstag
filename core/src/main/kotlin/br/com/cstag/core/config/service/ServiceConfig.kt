package br.com.cstag.core.config.service

import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan(basePackages = ["br.com.cstag.core.services"])
class ServiceConfig