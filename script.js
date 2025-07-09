document.addEventListener('DOMContentLoaded', () => {

const todoInput = document.querySelector('#todoInput')
const addButton = document.querySelector('#addBtn')
const filters = document.querySelector('.filters')
const todoList= document.querySelector('#todoList')
const stats = document.querySelector('#stats')


let tasks = JSON.parse(localStorage.getItem("tasks")) || []

tasks.forEach((tasks) => renderTask(tasks))
updateStats()
toggleEmptyState()

addButton.addEventListener('click', () => {
    const task = todoInput.value.trim()

    if(!task) return;

    const newTask = {
        id: Date.now(),
        text: task,
        isCompleted: false

  }

  tasks.push(newTask)
  saveTask()
  updateStats()
  toggleEmptyState()
  console.log(tasks)

  todoInput.value = '';
})

function updateStats(){
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => !task.isCompleted).length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
    document.getElementById('completedTasks').textContent = completedTasks;

}

function toggleEmptyState() {
    const emptyState = document.getElementById('emptyState');
    
    emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
}


filters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        
        const filterType = e.target.getAttribute('data-filter');
        showFilteredTasks(filterType);
    }
});

function renderTask(tasks) {
    const emptyState = document.querySelector('#emptyState');
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const li = document.createElement('li')
    li.className = 'todo-item'
    li.setAttribute('data-id', tasks.id);
    if(tasks.isCompleted) {li.classList.add("completed")}
    
    li.innerHTML = `
     <input type="checkbox" class="todo-checkbox" ${tasks.isCompleted ? 'checked' : ''}>
        <span class="todo-text">${tasks.text}</span>
        <button class="delete-btn">Delete</button>
    `
    todoList.appendChild(li);
}

todoList.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-btn')) {
        const todoItem = e.target.closest('.todo-item');
        const taskId = todoItem.getAttribute('data-id')

        tasks = tasks.filter(task => task.id != taskId )
        todoItem.remove();
        saveTask();
        updateStats();
        toggleEmptyState()
        
    }

    if(e.target.classList.contains('todo-checkbox')){
        const todoItem = e.target.closest('.todo-item');
        const taskId = todoItem.getAttribute('data-id');
        const taskIndex = tasks.findIndex(task => task.id == taskId)
        tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
        todoItem.classList.toggle('completed');
        saveTask();
        updateStats();
        toggleEmptyState()
        
    }
})

function saveTask() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
})