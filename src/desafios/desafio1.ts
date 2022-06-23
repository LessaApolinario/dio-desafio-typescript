// Como podemos rodar isso em um arquivo .ts sem causar erros?

interface Employee {
  code: number
  name: string
}

// eslint-disable-next-line
const employee: Employee = {
  code: 10,
  name: 'John'
}

console.log(employee)
