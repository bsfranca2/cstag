package br.com.cstag.core.services.analyze.utils

object WordFollowedByNumberRetriever {
    fun retrieve(word: String, sentence: String): String {
        val sentenceWithoutWordIndex = sentence.toUpperCase().indexOf(word.toUpperCase()) + word.length
        val sentenceWithoutWord = sentence.substring(sentenceWithoutWordIndex).trim()
        val firstWordInSentenceStartingInWordIndex = getFirstWordIndex(sentenceWithoutWord)
            ?: return removeUnnecessaryChars(sentenceWithoutWord)
        val number = sentence.substring(sentenceWithoutWordIndex, sentenceWithoutWordIndex + firstWordInSentenceStartingInWordIndex)
        return removeUnnecessaryChars(number)
    }

    private fun getFirstWordIndex(string: String): Int? {
        var firstAbcdIndex: Int? = null
        for (i in string.indices) {
            val currChar = string[i]
            val nextChar = string.getOrNull(i+1)
            if (isAbcd(currChar) && (nextChar == null || isAbcd(nextChar))) {
                firstAbcdIndex = i
                break
            }
        }
        return firstAbcdIndex
    }

    private fun removeUnnecessaryChars(value: String): String {
        val string = value.trim()
        var endChar = string.length
        var startChar = 0
        for (i in string.indices) {
            if (string[i].isDigit()) {
                startChar = i
                break
            }
        }
        for (i in (string.length - 1) downTo 0) {
            val prevChar = string.getOrNull(i+1)
            val currChar = string[i]
            val nextChar = string.getOrNull(i-1)
            if ((isAbcd(currChar) || currChar == ' ') && nextChar?.isDigit() == true && !isCommaInNumber(prevChar, currChar, nextChar)) {
                endChar = i
                break
            }
        }
        return string.substring(startChar, endChar)
    }

    private fun isCommaInNumber(prevChar: Char?, currChar: Char, nextChar: Char?): Boolean {
        return prevChar?.isDigit() == true && currChar == ',' && nextChar?.isDigit() == true
    }

    private fun isAbcd(char: Char): Boolean {
        return char.isLetter() || char == '-' || char == ','
    }
}