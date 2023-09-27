package br.com.cstag.core.services

import br.com.cstag.core.repositories.StorageRepository
import org.springframework.stereotype.Service

@Service
class StorageService(
    private val storageRepository: StorageRepository,
    private val objectStorageRepository: StorageRepository
) {
}