const nav = document.createElement('nav')
document.body.appendChild(nav)

const ul = document.createElement('ul') as HTMLUListElement
nav.appendChild(ul)

const listItems = [
  '<li><a href="./html/desafio1.html">Desafio 1</a></li>',
  '<li><a href="./html/desafio2.html">Desafio 2</a></li>',
  '<li><a href="./html/desafio3.html">Desafio 3</a></li>',
  '<li><a href="./html/desafio4.html">Desafio 4</a></li>'
]

ul.innerHTML = listItems.join('')
