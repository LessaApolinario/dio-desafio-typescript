// O código abaixo tem alguns erros e não funciona como deveria. Você pode identificar quais são e corrigi-los em um arquivo TS?

const botaoAtualizar = document.getElementById('atualizar-saldo') as HTMLButtonElement
const botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement
const soma = document.getElementById('soma') as HTMLInputElement
const campoSaldo = document.getElementById('campo-saldo') as HTMLSpanElement

campoSaldo.textContent = '0'

function somarAoSaldo (soma: number) {
  let saldoAtual = Number(campoSaldo.textContent)
  saldoAtual += soma
  campoSaldo.textContent = saldoAtual.toString()
}

function limparSaldo () {
  campoSaldo.textContent = ''
}

botaoAtualizar?.addEventListener('click', () => {
  somarAoSaldo(Number(soma.value))
})

botaoLimpar?.addEventListener('click', () => {
  limparSaldo()
})

/**
    <h4>Valor a ser adicionado: <input id="soma"> </h4>
    <button id="atualizar-saldo">Atualizar saldo</button>
    <button id="limpar-saldo">Limpar seu saldo</button>
    <h1>"Seu saldo é: " <span id="campo-saldo"></span></h1>
 */
