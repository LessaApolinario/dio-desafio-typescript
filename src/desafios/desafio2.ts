// Como podemos melhorar o esse código usando TS?

// eslint-disable-next-line
enum IProfissao {
  // eslint-disable-next-line
  Atriz,
  // eslint-disable-next-line
  Padeiro
}

interface IPessoa {
  nome: string
  idade: number
  profissao: IProfissao
}

const pessoa1: IPessoa = {
  nome: 'Maria',
  idade: 29,
  profissao: IProfissao.Atriz
}

const pessoa2: IPessoa = {
  nome: 'Roberto',
  idade: 19,
  profissao: IProfissao.Padeiro
}

const pessoa3: IPessoa = {
  nome: 'Laura',
  idade: 32,
  profissao: IProfissao.Atriz
}

const pessoa4: IPessoa = {
  nome: 'Carlos',
  idade: 19,
  profissao: IProfissao.Padeiro
}

const pessoas: IPessoa[] = []

pessoas.push(pessoa1)
pessoas.push(pessoa2)
pessoas.push(pessoa3)
pessoas.push(pessoa4)

pessoas.forEach(pessoa => console.log(pessoa))

export { pessoas }
