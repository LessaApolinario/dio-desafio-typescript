// Como podemos rodar isso em um arquivo .ts sem causar erros?

interface Employee {
  code: number
  name: string
}

const employee: Employee = {
  code: 11,
  name: 'Doe'
}

employee.code = 10
employee.name = 'John'
