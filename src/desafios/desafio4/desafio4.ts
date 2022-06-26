// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que:
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
// eslint-disable-next-line
const apiKeyInput = document.getElementById('api-key') as HTMLInputElement
// eslint-disable-next-line
let apiKey: string
// eslint-disable-next-line
const loginContainer = document.querySelector('#login-container') as HTMLFormElement
// eslint-disable-next-line
const usernameInput = document.getElementById('login') as HTMLInputElement
// eslint-disable-next-line
let username: string
// eslint-disable-next-line
const passwordInput = document.getElementById('senha') as HTMLInputElement
// eslint-disable-next-line
let password: string
// eslint-disable-next-line
const loginButton = document.getElementById('login-button') as HTMLButtonElement
// eslint-disable-next-line
const searchButton = document.getElementById('search-button') as HTMLButtonElement
// eslint-disable-next-line
const searchContainer = document.getElementById('search-container') as HTMLFormElement

const baseUrl = 'https://api.themoviedb.org/3'
let requestToken: string
let sessionId: string

interface RequestTokenData {
  sucess: boolean
  expires_at: string
  request_token: string
}

interface SessionData {
  sucess: boolean
  session_id: string
}

// eslint-disable-next-line
const api = async <T>(req: Request) => {
  const res = await fetch(req)
  const data = await res.json()
  return <T>data
}

// eslint-disable-next-line
const criarRequestToken = async () => {
  apiKey = apiKeyInput.value

  const req = new Request(`${baseUrl}/authentication/token/new?api_key=${apiKey}`, {
    method: 'GET'
  })

  const response = await api<RequestTokenData>(req)
  const { request_token } = response
  requestToken = request_token
}

const logar = async () => {
  apiKey = apiKeyInput.value

  const formData = new FormData(loginContainer)
  formData.delete('api_key')
  formData.append('request_token', requestToken)

  const req = new Request(`${baseUrl}/authentication/token/validate_with_login?api_key=${apiKey}`, {
    method: 'POST',
    body: formData
  })

  await api<RequestTokenData>(req)
}

const criarSessao = async () => {
  apiKey = apiKeyInput.value
  const req = new Request(`${baseUrl}/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`, {
    method: 'POST'
  })
  const response = await api<SessionData>(req)
  const { session_id } = response
  sessionId = session_id
}

loginButton.addEventListener('click', async (event) => {
  event.preventDefault()

  try {
    await criarRequestToken()
    await logar()
    await criarSessao()
  } catch (error) {
    console.log(error)
  }
})

const validateLoginButton = () => {
  loginButton.disabled = Boolean(password && username && apiKey)

  if (loginButton.disabled) {
    loginButton.removeAttribute('disabled')
  } else {
    loginButton.setAttribute('disabled', 'true')
  }
}

const preencherLogin = () => {
  username = usernameInput.value
  validateLoginButton()
}

const preencherSenha = () => {
  password = passwordInput.value
  validateLoginButton()
}

const preencherApi = () => {
  apiKey = apiKeyInput.value
  validateLoginButton()
}

// loginButton.addEventListener('click', async (event) => {
// try {
//   await criarRequestToken()
//   await logar()
//   await criarSessao()
// } catch (error) {
//   console.log(error)
// }
// })

// var apiKey = '3f301be7381a03ad8d352314dcc3ec1d'
// let apiKey
// let requestToken
// let username
// let password
// let sessionId
// const listId = '7101979'

// const loginButton = document.getElementById('login-button')
// const searchButton = document.getElementById('search-button')
// const searchContainer = document.getElementById('search-container')

// loginButton.addEventListener('click', async () => {
//   await criarRequestToken()
//   await logar()
//   await criarSessao()
// })

// searchButton.addEventListener('click', async () => {
//   const lista = document.getElementById('lista')
//   if (lista) {
//     lista.outerHTML = ''
//   }
//   const query = document.getElementById('search').value
//   const listaDeFilmes = await procurarFilme(query)
//   const ul = document.createElement('ul')
//   ul.id = 'lista'
//   for (const item of listaDeFilmes.results) {
//     const li = document.createElement('li')
//     li.appendChild(document.createTextNode(item.original_title))
//     ul.appendChild(li)
//   }
//   console.log(listaDeFilmes)
//   searchContainer.appendChild(ul)
// })

// function preencherSenha () {
//   password = document.getElementById('senha').value
//   validateLoginButton()
// }

// function preencherLogin () {
//   username = document.getElementById('login').value
//   validateLoginButton()
// }

// function preencherApi () {
//   apiKey = document.getElementById('api-key').value
//   validateLoginButton()
// }

// function validateLoginButton () {
//   if (password && username && apiKey) {
//     loginButton.disabled = false
//   } else {
//     loginButton.disabled = true
//   }
// }

// class HttpClient {
//   static async get ({ url, method, body = null }) {
//     return new Promise((resolve, reject) => {
//       const request = new XMLHttpRequest()
//       request.open(method, url, true)

//       request.onload = () => {
//         if (request.status >= 200 && request.status < 300) {
//           resolve(JSON.parse(request.responseText))
//         } else {
//           reject({
//             status: request.status,
//             statusText: request.statusText
//           })
//         }
//       }
//       request.onerror = () => {
//         reject({
//           status: request.status,
//           statusText: request.statusText
//         })
//       }

//       if (body) {
//         request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
//         body = JSON.stringify(body)
//       }
//       request.send(body)
//     })
//   }
// }

// async function procurarFilme (query) {
//   query = encodeURI(query)
//   console.log(query)
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
//     method: 'GET'
//   })
//   return result
// }

// async function adicionarFilme (filmeId) {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
//     method: 'GET'
//   })
//   console.log(result)
// }

// async function criarRequestToken () {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
//     method: 'GET'
//   })
//   requestToken = result.request_token
// }

// async function logar () {
//   await HttpClient.get({
//     url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
//     method: 'POST',
//     body: {
//       username: `${username}`,
//       password: `${password}`,
//       request_token: `${requestToken}`
//     }
//   })
// }

// async function criarSessao () {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
//     method: 'GET'
//   })
//   sessionId = result.session_id
// }

// async function criarLista (nomeDaLista, descricao) {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
//     method: 'POST',
//     body: {
//       name: nomeDaLista,
//       description: descricao,
//       language: 'pt-br'
//     }
//   })
//   console.log(result)
// }

// async function adicionarFilmeNaLista (filmeId, listaId) {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
//     method: 'POST',
//     body: {
//       media_id: filmeId
//     }
//   })
//   console.log(result)
// }

// async function pegarLista () {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
//     method: 'GET'
//   })
//   console.log(result)
// }

/* <div style="display: flex;">
  <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
      <input id="login" placeholder="Login" onchange="preencherLogin(event)">
      <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
      <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
      <button id="login-button" disabled>Login</button>
  </div>
  <div id="search-container" style="margin-left: 20px">
      <input id="search" placeholder="Escreva...">
      <button id="search-button">Pesquisar Filme</button>
  </div>
</div> */
