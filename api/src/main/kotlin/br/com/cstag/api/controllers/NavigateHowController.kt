package br.com.cstag.api.controllers

import br.com.cstag.api.dto.toTokenDto
import br.com.cstag.api.services.NavigateHowService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/navigate-how")
class NavigateHowController {

    @Autowired
    private lateinit var navigateHowService: NavigateHowService

    @PostMapping("/{companyCNPJ}")
    fun navigate(@PathVariable companyCNPJ: String) =
        try {
            val tokenDto = navigateHowService.navigate(companyCNPJ).toTokenDto()
            ResponseEntity(tokenDto, HttpStatus.OK)
        } catch (e: Exception) {
            ResponseEntity(null, HttpStatus.FORBIDDEN)
        }
}