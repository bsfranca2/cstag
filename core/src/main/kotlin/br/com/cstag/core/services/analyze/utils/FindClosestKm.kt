package br.com.cstag.core.services.analyze.utils

object FindClosestKm {
    fun findIndex(kmTarget: String, listOfKm: List<String>): Int {
        val kmTargetSplit = SplitKm.valueOf(kmTarget)
        val listOfKmSplit = listOfKm.map {
            try {
                SplitKm.valueOf(it)
            } catch (e: Exception) {
                SplitKm.valueOf(KmNumberRetriever.retrieve(it))
            }
        }.sort()

        val firstPartClosestNumber =
            FindClosestNumber.findClosest(listOfKmSplit.map { it.parts[0] }, kmTargetSplit.parts[0])
        val listFilteredWithFirstPartClosestNumber = listOfKmSplit.filter { it.parts[0] == firstPartClosestNumber }

        val secondPartOfKmNumber = kmTargetSplit.parts.getOrNull(1)
        if (secondPartOfKmNumber == null) {
            val result = listFilteredWithFirstPartClosestNumber.find { it.parts.size == 1 }
            if (result == null) {
                val firstItemFromListFiltered = listFilteredWithFirstPartClosestNumber[0]
                return listOfKm.indexOf(firstItemFromListFiltered.source)
            }
            return listOfKm.indexOf(result.source)
        }

        tryFindExactSecondNumber(kmTargetSplit, listFilteredWithFirstPartClosestNumber)?.let {
            return listOfKm.indexOf(it.source)
        }

        val secondPartOfKmNumberClosest = FindClosestNumber.findClosest(
            listFilteredWithFirstPartClosestNumber.map { it.parts.getOrElse(1) { 0 } }, secondPartOfKmNumber
        )
        val result = listFilteredWithFirstPartClosestNumber.find {
            it.parts[0] == firstPartClosestNumber && it.parts.getOrElse(1) {0} == secondPartOfKmNumberClosest
        } ?: throw Error("Result not found")
        return listOfKm.indexOf(result.source)
    }

    private fun tryFindExactSecondNumber(km: SplitKm, listOfKm: List<SplitKm>): SplitKm? {
        val secondNumber = km.parts.getOrElse(1) {0}
        listOfKm.forEach {
            val itemSecondNumber = it.parts.getOrElse(1) {0}
            if ((itemSecondNumber == secondNumber)
                || (itemSecondNumber == "${secondNumber}0".toInt())
                || (itemSecondNumber == "${secondNumber}00".toInt()))
                    return it
        }
        return null
    }
}