// SELEÇÃO DOS ELEMENTOS
const previousOperationText = document.querySelector("#previous-operation")
const currentOperationText = document.querySelector("#current-operation")
const buttons = document.querySelectorAll("#buttons-container button")

// LÓGICA DA APLICAÇÃO
class Calculator {
    constructor(previousOperationText, currentOperationText) {
        this.previousOperationText = previousOperationText
        this.currentOperationText = currentOperationText
        this.currentOperation = ""
    }

    // adiciona o dígito na tela da calculadora
    addDigit(digit) {
        // checa se já há um ponto na operação atual
        if(digit === "." && this.currentOperationText.innerText.includes(".")) {
            return
        }

        this.currentOperation = digit
        this.updateScreen()
    }
    
    // processa todas as operações da calculadora
    processOperation(operation) {
        // checar se o valor atual está vazio
        if(this.currentOperationText.innerText === "" && operation !== "C") {
            // mudar operação
            if(this.previousOperationText.innerText !== "") {
                this.changeOperation(operation)
            }
            return
        }

        // obtém o valor atual e anterior
        let operationValue
        const previous = +this.previousOperationText.innerText.split(" ")[0]
        const current = +this.currentOperationText.innerText

        // realiza a operação
        switch(operation) {
            case "+":
                operationValue = previous + current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "-":
                operationValue = previous - current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "/":
                operationValue = previous / current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "*":
                operationValue = previous * current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "DEL":
                this.processDelOperator()
                break
            case "CE":
                this.processClearCurrentOperation()
                break
            case "C":
                this.porcessClearOperation()
                break
            case "=":
                this.processEqualOperator()
                this.currentOperationText.innerHTML = this.previousOperationText.innerHTML.split(" ")[0]
                this.previousOperationText.innerHTML = ""
                break
            default:
                return
        }
    }

    // atualiza a tela da calculadora
    updateScreen(
        operationValue = null,
        operation = null,
        current = null,
        previous = null
        ) {

        if(operationValue === null) {
            this.currentOperationText.innerText += this.currentOperation
        } else {
            // checa se o valor é 0, se for, add o valor atual
            if(previous === 0) {
                operationValue = current
            }

            // add o valor atual para o anterior
            this.previousOperationText.innerText = `${operationValue} ${operation}`
            // zera o valor atual
            this.currentOperationText.innerText = ""
        }   
    }

    // mudança de operação matemática
    changeOperation(operation) {
        const mathOperations = ["*", "/", "+", "-"]

        // aborta a lógica caso não receba uma operação válida
        if(!mathOperations.includes(operation)) {
            return
        }

        // tira o último caractere que é o símbolo de operação
        this.previousOperationText.innerText = this.previousOperationText.innerText.slice(0, -1) + operation
    }

    // deleta o último dígito 
    processDelOperator() {
        this.currentOperationText.innerText = this.currentOperationText.innerText.slice(0, -1)
    }

    // deleta a operação atual
    processClearCurrentOperation() {
        this.currentOperationText.innerText = ""
    }

    // deleta toda a operação da calculadora
    porcessClearOperation() {
        this.currentOperationText.innerText = ""
        this.previousOperationText.innerText = ""
    }

    // botão igual
    processEqualOperator() {
        const operation = previousOperationText.innerText.split(" ")[1]

        this.processOperation(operation)
    }
}

const calc = new Calculator(previousOperationText, currentOperationText)

// EVENTOS DA APLICAÇÃO
buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        // obtendo o texto de qual tecla foi clicada
        const value = e.target.innerText

        // checando se o usuário clicou em um número ou
        // em uma tecla de operação
        if(+value >= 0 || value === ".") {
            calc.addDigit(value)
        } else {
            calc.processOperation(value)
        }
    })
})