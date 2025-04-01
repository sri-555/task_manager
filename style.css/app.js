

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.addEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.taskPriority = document.getElementById('taskPriority');
        this.dueDate = document.getElementById('dueDate');
        this.addTaskBtn = document.getElementById('addTask');
        this.taskList = document.getElementById('taskList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
    }

    addEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterTasks(e));
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false,
                priority: this.taskPriority.value,
                dueDate: this.dueDate.value,
                createdAt: new Date().toISOString()
            };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
            this.showNotification('Task added successfully!');
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification('Task deleted!');
    }

    filterTasks(e) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTasks();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification('Completed tasks cleared!');
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
                
                taskElement.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-text">${task.text}</div>
                        <div class="task-meta">
                            Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            ${task.dueDate ? ` | Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                const checkbox = taskElement.querySelector('.task-checkbox');
                checkbox.addEventListener('change', () => this.toggleTask(task.id));

                const deleteBtn = taskElement.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

                this.taskList.appendChild(taskElement);
            });

        this.updateStats();
    }

    updateStats() {
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');
        
        const completed = this.tasks.filter(task => task.completed).length;
        totalTasks.textContent = `Total Tasks: ${this.tasks.length}`;
        completedTasks.textContent = `Completed: ${completed}`;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #e91e63;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => notification.style.opacity = '1', 10);

        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize the Task Manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});

    