package br.com.cstag.core.exceptions

class BadCredentialsException(val source: String) : RuntimeException("CNPJ ou senha inválido")