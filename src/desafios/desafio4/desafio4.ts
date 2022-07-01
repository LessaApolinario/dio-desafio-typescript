// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que:
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
const apiKeyInput = document.getElementById('api-key') as HTMLInputElement
let apiKey: string

const loginContainer = document.querySelector('#login-container') as HTMLFormElement

const usernameInput = document.getElementById('login') as HTMLInputElement
let username: string

const passwordInput = document.getElementById('senha') as HTMLInputElement
let password: string

const loginButton = document.getElementById('login-button') as HTMLButtonElement

const searchButton = document.getElementById('search-button') as HTMLButtonElement

const searchContainer = document.getElementById('search-container') as HTMLFormElement

const searchInput = document.getElementById('search') as HTMLInputElement

const addFilmeButton = document.querySelector('button[type="button"]') as HTMLButtonElement

const movieInput = document.getElementById('movie-id') as HTMLInputElement

const addFilmeList = document.querySelector('ul[data-js="movies"]') as HTMLUListElement

const listNameInput = document.getElementById('nome-da-lista') as HTMLInputElement

const listDescriptionInput = document.getElementById('descricao') as HTMLInputElement

const listIdInput = document.getElementById('list-id') as HTMLInputElement

const movieIdInput = document.getElementById('add-movie-id') as HTMLInputElement

const createListButton = document.getElementById('create-list') as HTMLButtonElement

const addMovieButton = document.getElementById('add-movie-into-list') as HTMLButtonElement

const getCreatedListDiv = document.querySelector('.get-list') as HTMLDivElement

const getListButton = document.getElementById('get-list') as HTMLButtonElement

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

interface Movie {
  adult: boolean
  homepage: string
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  release_date: string
  title: string
  sucess: boolean
  status_code: number
  status_message: string
}

type MoviesResults = {
  results: Movie[]
}

interface List {
  list_id: number
  status_code: number
  status_message: string
  sucess: boolean
}

interface CreatedList {
  created_by: string
  description: string
  id: number
  items: Movie[]
  name: string
}

const api = async <T>(req: Request): Promise<T | undefined> => {
  try {
    const response = await fetch(req)
    const { ok, status } = response

    console.log('status code: ', status)

    if (!ok && status === 404) {
      throw new Error(`Erro na requisição! status: ${status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

const criarRequestToken = async () => {
  apiKey = apiKeyInput.value

  const req = new Request(`${baseUrl}/authentication/token/new?api_key=${apiKey}`, {
    method: 'GET'
  })

  const response = await api<RequestTokenData>(req)
  const { request_token } = response
  return request_token
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
  return session_id
}

loginButton.addEventListener('click', async (event) => {
  event.preventDefault()

  try {
    requestToken = await criarRequestToken()
    await logar()
    sessionId = await criarSessao()
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
  if (!dateAsString.includes('-')) {
    return ''
  }

  const date = dateAsString.split('-')

  let [year, month, day] = date

  month = Number(month) < 10
    ? month = month.replace('0', '')
    : month

  month = abbreviateMonth(month)

  return `${day} de ${month} de ${year}`
}

const createMovie = (movie: Movie) => {
  const { adult, homepage, original_language, original_title } = movie
  const { overview, popularity, release_date } = movie

  const elementAsString = `
      <a href="${homepage}" target="_blank" class="title">${original_title}</a>
      <p class="language">Language: <span>${original_language}</span></p>
      <p class="overview">Overview: <span>${overview}</span></p>
      <p class="popularity">Popularity: ${popularity}</p>
      <p class="release_date">${formatDate(release_date)}</p>
    `

  if (adult) {
    return `
      ${elementAsString}
      <p class="adult">Atenção, este filme é para adultos</p>
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

  listaDeFilmes.map(item => {
    const li = document.createElement('li')
    li.innerHTML = createMovie(item)
    ul.appendChild(li)

    return li
  })

  searchContainer.appendChild(ul)
})

const adicionarFilme = async (filmeId: number) => {
  apiKey = apiKeyInput.value
  const req = new Request(`${baseUrl}/movie/${filmeId}?api_key=${apiKey}&language=en-US`, {
    method: 'GET'
  })

  try {
    const movie = await api<Movie>(req)
    return movie
  } catch (error) {
    console.log(error)
  }
}

addFilmeButton.addEventListener('click', async (event) => {
  event.preventDefault()
  const id = Number(movieInput.value)

  const li = document.createElement('li') as HTMLLIElement

  try {
    const movie = await adicionarFilme(id)

    if (typeof movie === 'undefined') {
      li.textContent = 'Este filme não existe!'
      li.classList.add('undefined-movie')
    } else {
      li.innerHTML = createMovie(movie)
    }

    addFilmeList.appendChild(li)
  } catch (error) {
    console.log(error)
  }
})

const criarLista = async (nomeDaLista: string, descricao: string) => {
  apiKey = apiKeyInput.value

  const formData = new FormData()
  formData.append('name', nomeDaLista)
  formData.append('description', descricao)
  formData.append('language', 'pt-br')

  const req = new Request(`${baseUrl}/list?api_key=${apiKey}&session_id=${sessionId}`, {
    method: 'POST',
    body: formData
  })

  const result = await api<List>(req)
  console.log(result)
  return result
}

const adicionarFilmeNaLista = async (filmeId: number, listaId: number) => {
  apiKey = apiKeyInput.value

  const formData = new FormData()
  formData.append('media_id', filmeId.toString())

  const req = new Request(`${baseUrl}/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`, {
    method: 'POST',
    body: formData
  })

  const result = await api<Movie>(req)
  return result
}

createListButton.addEventListener('click', async (event) => {
  event.preventDefault()

  const nomeDaLista = listNameInput.value
  const descricao = listDescriptionInput.value

  try {
    const { sucess, list_id } = await criarLista(nomeDaLista, descricao)

    if (sucess) {
      console.log('Lista criada com sucesso, ID: ', list_id)
    }
  } catch (error) {
    console.log(error)
  }
})

addMovieButton.addEventListener('click', async (event) => {
  event.preventDefault()
  const filmeId = Number(movieIdInput.value)
  const listaId = Number(listIdInput.value)

  try {
    const { sucess } = await adicionarFilmeNaLista(filmeId, listaId)

    if (sucess) {
      console.log('Filme adicionado com sucesso!')
    } else {
      console.log('O filme não existe!')
    }
  } catch (error) {
    console.log(error)
  }
})

const pegarLista = async () => {
  apiKey = apiKeyInput.value
  const listId = listIdInput.value

  const req = new Request(`${baseUrl}/list/${listId}?api_key=${apiKey}`, {
    method: 'GET'
  })

  const result = await api<CreatedList>(req)

  console.log(result)

  return result
}

const insertCreatedListIntoDOM = (createdList: CreatedList) => {
  const { created_by, description, items, name } = createdList

  const list = document.getElementById('lista-criada') as HTMLUListElement

  // Atualiza a lista
  if (list) {
    list.innerHTML = ''
    list.remove()
  }

  const ul = document.createElement('ul') as HTMLUListElement
  ul.id = 'lista-criada'
  getCreatedListDiv.appendChild(ul)

  const h2 = document.createElement('h2') as HTMLHeadingElement
  h2.textContent = `Lista criada por ${created_by}`

  ul.appendChild(h2)

  const h3 = document.createElement('h3') as HTMLHeadingElement
  h3.textContent = `${name} | ${description}`

  ul.appendChild(h3)

  items.map(item => {
    const li = document.createElement('li') as HTMLLIElement
    li.classList.add('movie-item')

    li.innerHTML = createMovie(item)

    ul.appendChild(li)
    return li
  })
}

getListButton.addEventListener('click', async (event) => {
  event.preventDefault()

  try {
    const createdList = await pegarLista()
    insertCreatedListIntoDOM(createdList)
  } catch (error) {
    console.log(error)
  }
})
