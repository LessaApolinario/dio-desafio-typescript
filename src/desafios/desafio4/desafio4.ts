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
// eslint-disable-next-line
const searchInput = document.getElementById('search') as HTMLInputElement

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
    method: 'GET'
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

usernameInput.addEventListener('change', preencherLogin)

passwordInput.addEventListener('change', preencherSenha)

apiKeyInput.addEventListener('change', preencherApi)

interface Movie {
  adult: boolean
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  release_date: string
  title: string
}

type MoviesResults = {
  results: Movie[]
}

const procurarFilme = async (query: string) => {
  query = encodeURI(query)

  const req = new Request(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`, {
    method: 'GET'
  })
  const response = await api<MoviesResults>(req)
  const { results } = response

  return results
}

const abbreviateMonth = (month: string) => {
  const months: Record<string, string> = {
    1: 'jan',
    2: 'fev',
    3: 'mar',
    4: 'abr',
    5: 'maio',
    6: 'jun',
    7: 'jul',
    8: 'ago',
    9: 'set',
    10: 'out',
    11: 'nov',
    12: 'dez'
  }

  return months[month] || 'Não existe um mês do ano correspondente'
}

const formatDate = (dateAsString: string) => {
  const date = new Date(dateAsString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  const abbreviatedMonth = abbreviateMonth(month.toString())

  return dateAsString.includes('-')
    ? `${day} de ${abbreviatedMonth} de ${year}`
    : dateAsString
}

const createMovie = (movie: Movie) => {
  const { adult, original_language, original_title } = movie
  const { overview, popularity, release_date } = movie

  const elementAsString = `
    <p>${original_title}</p>
    <p>Lang: ${original_language}</p>
    <p>${overview}</p>
    <p>${popularity}</p>
    <p>${formatDate(release_date)}</p>
  `

  if (adult) {
    return `
      ${elementAsString}
      <p style="font-weight: bold;color: red;">Atenção, este filme é para adultos</p>
    `
  }

  return elementAsString
}

searchButton.addEventListener('click', async (event) => {
  event.preventDefault()

  const lista = document.getElementById('lista')

  if (lista) {
    lista.outerHTML = ''
  }

  const query = searchInput.value
  const listaDeFilmes = await procurarFilme(query)
  const ul = document.createElement('ul')
  ul.id = 'lista'

  for (const item of listaDeFilmes) {
    const li = document.createElement('li')
    li.innerHTML = createMovie(item)
    ul.appendChild(li)
  }

  searchContainer.appendChild(ul)
})

// async function adicionarFilme (filmeId) {
//   const result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
//     method: 'GET'
//   })
//   console.log(result)
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
