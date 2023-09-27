package br.com.cstag.api.utils

import org.springframework.web.multipart.MultipartFile
import java.io.File

object FileUtil {
    private fun convertMultiPartFileToFile(multipartFile: MultipartFile): File {
        val file = File.createTempFile("frommultipart-", "")
        multipartFile.transferTo(file)
        return file
    }

    fun MultipartFile.toFile() = convertMultiPartFileToFile(this)
}