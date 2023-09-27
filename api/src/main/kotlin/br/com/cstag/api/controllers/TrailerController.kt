package br.com.cstag.api.controllers

import br.com.cstag.api.security.AccountLoggedContextService
import br.com.cstag.api.utils.FileUtil.toFile
import br.com.cstag.core.entities.Trailer
import br.com.cstag.core.services.trailer.ImportTrailerService
import br.com.cstag.core.services.trailer.TrailerService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/trailers")
class TrailerController {
    @Autowired
    lateinit var trailerService: TrailerService
    @Autowired
    lateinit var importTrailerService: ImportTrailerService
    @Autowired
    lateinit var accountLoggedContextService: AccountLoggedContextService

    fun getAccount() =
        accountLoggedContextService.getAccount()

    @GetMapping
    fun getAll(): List<Trailer> {
        return trailerService.findAll(getAccount())
    }

    @PostMapping("/upload", consumes = ["multipart/form-data"])
    @ResponseStatus(HttpStatus.CREATED)
    fun upload(@RequestPart("file") file: MultipartFile) {
        importTrailerService.import(getAccount(), file.toFile())
    }
}