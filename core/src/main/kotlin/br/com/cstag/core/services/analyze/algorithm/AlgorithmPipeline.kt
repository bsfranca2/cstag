package br.com.cstag.core.services.analyze.algorithm

class AlgorithmPipeline<T>(
    var item: T,
) {
    fun and(algorithm: (analysis: T) -> T): AlgorithmPipeline<T> {
        item = algorithm(item)
        return this
    }
}
