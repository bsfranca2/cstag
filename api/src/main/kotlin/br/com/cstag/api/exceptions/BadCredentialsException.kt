package br.com.cstag.api.exceptions

class BadCredentialsException(val source: String) : RuntimeException("CNPJ ou senha inválido")