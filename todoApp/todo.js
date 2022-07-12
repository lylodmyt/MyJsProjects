let inputEl = document.getElementById("input")
let todos = document.getElementById('todos')
let addBtn = document.getElementById('add')

let shAll = document.getElementById('all')
let shActive = document.getElementById('active')
let shComplete = document.getElementById('complete')

shAll.addEventListener('click', showAll)
shActive.addEventListener('click', showActive)
shComplete.addEventListener('click', showComplete)

let tasks
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


addBtn.addEventListener("click", function (){
    console.log('click')
    if (inputEl.value !== ''){
        tasks.push({name: inputEl.value, complete: false})
        inputEl.value = ''
        updateLocalStorage()
        render(tasks)
    }
})

function render(tasks){
    todos.innerHTML = ''
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i].complete){
            todos.innerHTML += `
            <div class="todo">
                <span class="task">${tasks[i].name.toString()}</span> 
                <input type="checkbox" onclick="completeChange(${i})" checked>
                <button class="delete" onclick="deleteTask(${i})">DEL</button>
            </div>
        `
        }else {
            todos.innerHTML += `
            <div class="todo">
                <span class="task">${tasks[i].name}</span> 
                <input type="checkbox" onclick="completeChange(${i})">
                <button class="delete" onclick="deleteTask(${i})">DEL</button>
            </div>
        `
        }
    }
}

deleteTask = index => {
    tasks.splice(index, 1)
    updateLocalStorage()
    render(tasks)
}

completeChange = index => {
    tasks[index].complete = !tasks[index].complete
    updateLocalStorage()
}

function showAll(){
    render(tasks)
}

function showActive(){
    let res = [];
    for (let i = 0; i < tasks.length; i++){
        if (!tasks[i].complete) res.push(tasks[i])
    }
    render(res)
}

function showComplete(){
    let res = [];
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i].complete) res.push(tasks[i])
    }
    render(res)
}


render(tasks)