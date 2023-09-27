package br.com.cstag.core.entities

import javax.persistence.*

@Entity
@Table(name = "variables")
data class Variable(
    val variableName: String,
    var value: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
}

interface Variables {
    val variables: MutableList<Variable>

    fun getVariable(variableName: String): Variable? {
        return variables.find { it.variableName == variableName }
    }

    fun getVariableValue(variableName: String): String? {
        return getVariable(variableName)?.value
    }

    fun addVariable(variableName: String, value: String) {
        val variable = Variable(variableName, value)
        variables.add(variable)
    }

    fun addVariable(variableName: String, value: Any) {
        return addVariable(variableName, value.toString())
    }

    fun removeVariable(variableName: String) {
        val variable = variables.find { it.variableName == variableName }
        variables.remove(variable)
    }
}