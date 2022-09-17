// 1 - SELEÇÃO DE ELEMENTOS
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const toolbarForm = document.querySelector("#toolbar")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#button-addon2")
const filterBtn = document.querySelectorAll(".dropdown-item")
const darkThemeBtn = document.querySelector("#dark-btn")
const lightThemeBtn = document.querySelector("#light-btn")
const dark = "dark"
const light = "light"
const mainCard = document.querySelector("#main-card")

// declarando variável que armazenará o
// valor anterior do título da tarefa
let oldInputValue

// 2 - FUNÇÕES
// salvar tarefa
const saveTodo = (text, done = 0, save = 1) => {
    // criando tarefa
    const todo = document.createElement("div")
    todo.classList.add("todo")
    todo.classList.add("list-group-item")

    // criando título da tarefa
    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    // criando botão de finalizar tarefa
    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.classList.add("rounded")
    doneBtn.innerHTML = '<i class="bi bi-check-lg"></i>' // icone do botão
    todo.appendChild(doneBtn)

    // criando botão de editar tarefa
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.classList.add("rounded")
    editBtn.innerHTML = '<i class="bi bi-pen"></i>' // icone do botão
    todo.appendChild(editBtn)

    // criando botão de deletar tarefa
    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.classList.add("rounded")
    deleteBtn.innerHTML = '<i class="bi bi-x-lg"></i>' // icone do botão
    todo.appendChild(deleteBtn)

    // Utilizando dados da Local Storage
    if(done) {
        todo.classList.add("done")
    }

    if(save) {
        saveTodoLocalStorage({text, done})
    }

    // anexando tarefa a lista de tarefas
    todoList.appendChild(todo)

    // resetando campo de título da tarefa
    todoInput.value = ""

    // focando de volta ao campo de adicionar tarefa
    todoInput.focus()
}

// exibir/ocultar forms
const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
    toolbarForm.classList.toggle("hide")
}

// editar tarefa
const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text

            updateTodosLocalStorage(oldInputValue, text)
        }
    })
}

// filtrar tarefas
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo")

    switch(filterValue) {
        case "all":
            todos.forEach((todo) => todo.style.display = "flex")
            break

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
                )
                break

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
                )
                break
        default:
            break
    }
}

// pesquisar
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo")
    
    todos.forEach((todo) => {
        // puxando o texto do título e transformando-o em
        // lowercase para realizar a busca sem erros
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase()
        
        // transformando texto buscado também em caixa-baixa
        // para evitar erros na hora de pesquisar
        const normalizedSearch = search.toLowerCase()
        
        // mostrando elementos da lista até atingir o
        // valor esperado para executar o if abaixo
        todo.style.display = "flex"
        
        // procurando tarefas que não contém os termos
        // pesquisados para poder escondê-las
        if(!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none"
        }
    })
}

// mudar tema do app
function toggleTheme(value) {
    if(value === "light") {
        mainCard.classList.remove("text-bg-dark")
    } else {
        mainCard.classList.add("text-bg-dark")
    }
}

// 3 - EVENTOS
// adicionar tarefa
todoForm.addEventListener("submit", (e) => {
    // previnir que a página recarregue ao clicar no botão
    e.preventDefault()
    
    // pegar valor do input para criar tarefa nova
    const inputValue = todoInput.value

    // validação para o usuário não criar tarefas sem título
    if(inputValue) {
        // salvar tarefa
        saveTodo(inputValue)
    }
})

// eventos de click dos botões
document.addEventListener("click", (e) => {
    // identificando o elemento que foi clicado
    const targetEl = e.target
    // selecionando o elemento "div" pai do elemento clicado
    const parentEl = targetEl.closest("div")
    // declarando variável que armazenará o título da tarefa
    let todoTitle
    // checando se o elemento possui os pre-requisitos
    // para ser um título de tarefa
    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText
    }

    // botão de "completar tarefa"
    // checando se o elemento clicado contém determinada classe
    if(targetEl.classList.contains("finish-todo")){
        // adicionando a classe "done" para completar tarefa
        parentEl.classList.toggle("done")
        updateTodosStatusLocalStorage(todoTitle)
    }

    // botão de "remover tarefa"
    if(targetEl.classList.contains("remove-todo")) {
        // remove elemento pai
        parentEl.remove()

        removeTodoLocalStorage(todoTitle)
    }

    // botão de "editar tarefa"
    if(targetEl.classList.contains("edit-todo")) {
        // exibe/esconde form de "editar" e "criar" nova tarefa
        toggleForms()
        // atribuíndo título a variável "editInput"
        editInput.value = todoTitle
        // armazenando o valor original do título da tarefa
        oldInputValue = todoTitle
    }
})

// botão "cancelar"
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()
    toggleForms()
})

// botão "confirmar"
editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // pegar o valor novo que o usuário editou
    const editInputValue = editInput.value

    if(editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
})

// input search
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value
    getSearchTodos(search)
})

// botão resetar busca
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault()

    searchInput.value = ""
    searchInput.dispatchEvent(new Event("keyup"))
})

// lista de filtros
filterBtn.forEach((option) => {
    option.addEventListener("click", (e) => {
        let filterValue = e.target.getAttribute('data-value')
        filterTodos(filterValue)
    })
})

// botões para mudar o tema do app
darkThemeBtn.addEventListener("click", () => {
        toggleTheme(dark)
    })
lightThemeBtn.addEventListener("click", () => {
    toggleTheme(light)
})


// LOCAL STORAGE
// puxar tarefas
const getTodosLocalStorage = () => {
    // buscar tarefas ou iniciar uma array vazia
    const todos = JSON.parse(localStorage.getItem("todos")) || []
    return todos
}   

// carregar tarefas salvas no Local Storage
const loadTodos = () => {
    const todos = getTodosLocalStorage()
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}

// salvar tarefas
const saveTodoLocalStorage = (todo => {
    // puxar as tarefas do Local Storage
    const todos = getTodosLocalStorage()

    // adicionar a nova tarefa no array do Local Storage
    todos.push(todo)
    
    // salvar as tarefas no Local Storage
    localStorage.setItem("todos", JSON.stringify(todos))
})

// remover tarefas
const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()
    const filteredTodos = todos.filter((todo) => todo.text !== todoText)
    localStorage.setItem("todos", JSON.stringify(filteredTodos))
}

// atualizar dados do Local Storage
const updateTodosStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()
    todos.map((todo) =>
        todo.text === todoText
        ? todo.done = !todo.done
        : null
    )
    localStorage.setItem("todos", JSON.stringify(todos))
}

// atualizar texto da tarefa do Local Storage
const updateTodosLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()
    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    )
    localStorage.setItem("todos", JSON.stringify(todos))
}

loadTodos()

// ano atual (footer)
document.querySelector("#year").innerHTML = new Date().getFullYear()