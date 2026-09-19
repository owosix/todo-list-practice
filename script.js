const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const clearCompletedBtn = document.getElementById('clearCompleted');
const emptyState = document.getElementById('emptyState');

let tasks = [];

function loadTasks() {
    const savedTasks = localStorage.getItem('myTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}
function saveTasks() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}
function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content" data-index="${index}">
                <div class="checkbox">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span class="task-text">${task.text}</span>
            </div>
            <button class="delete-btn" data-index="${index}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        taskList.appendChild(li);
    });

    updateCounter();
}

// Обновление счетчика
function updateCounter() {
    const total = tasks.length;
    taskCounter.textContent = `Всего задач: ${total}`;
}
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        taskInput.style.borderColor = 'var(--danger)';
        setTimeout(() => {
            taskInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }, 500);
        return;
    }

    tasks.push({ text: text, completed: false });
    taskInput.value = '';
    
    saveTasks();
    renderTasks();
}
taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    const content = taskItem.querySelector('.task-content');
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const index = deleteBtn.dataset.index;
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        return;
    }
    if (content) {
        const index = content.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
});
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
loadTasks();
// --- Стикер и звук ---
const sticker = document.getElementById('sticker');
const popSound = document.getElementById('popSound');

sticker.addEventListener('click', () => {
    popSound.currentTime = 0;
    popSound.play().catch(err => console.log('Звук не проигрался:', err));

    // "Подпрыгивание" при клике
    sticker.style.animation = 'none';
    setTimeout(() => {
        sticker.style.animation = 'floatSticker 3s ease-in-out infinite';
    }, 10);
});