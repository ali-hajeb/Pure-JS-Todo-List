// const todoList = [
//   {
//     title: 'Test',
//     desc: 'This is a test.',
//     isCompleted: false
//   }
// ];

// Elements
const taskForm = document.querySelector('#task-form');
const taskForm_edit = document.querySelector('#task-edit-form');
const taskTitle = document.querySelector('#task-title');
const taskDesc = document.querySelector('#task-desc');
const taskTitle_edit = document.querySelector('#task-title--edit');
const taskDesc_edit = document.querySelector('#task-desc--edit');
const tasksGrid = document.querySelector('#tasks-grid');
const modal = document.querySelector('.modal');
const modalDialogue = document.querySelector('.modal-dialogue');
const modalDialogueCancelButton = document.querySelector('#modal-dialogue--cancel');
const alertsSection = document.querySelector('.alerts-section');

// UI Functions
// Create an alert element
const createAlert = (icon, message, className) => {
  const alertBox = document.createElement('div');
  alertBox.classList.add('alert', className);
  alertBox.innerHTML = `
    <div class="alert-icon">
      <i class="bi-${icon}"></i>
    </div>
    <div class="alert-message">
      ${message}
    </div>
  `;
  return alertBox;
}

// View alert element and set a timer to delete alert after 3s 
const viewAlert = (alertBox) => {
  alertsSection.appendChild(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

// Toggle modal visibility status
const modalToggler = () => {
  modal.classList.toggle('show');
}

const handleDeleteTask = (e) => {
  const [id] = getTaskIdAndCard(e.target);
  deleteTask(id);
  viewAlert(createAlert('trash', 'Task deleted successfully!', 'green'));
}

const handleEditTask = (e) => {
  const [id] = getTaskIdAndCard(e.target);
  editTask(id);
}

const handleStatusChange = (e) => {
  const [id, taskCard] = getTaskIdAndCard(e.target);
  changeTaskStatus(e.target, taskCard, id);
  viewAlert(createAlert('exclamation-circle', 'Task status changed successfully!', 'green'));
}

// Task List Functions
// Return todo list
const getTodoList = () => {
  const todoList = JSON.parse(localStorage.getItem('todo-list'));
  return todoList || [];
}

// Save todo list
const saveTodoList = (todoList) => {
  localStorage.setItem('todo-list', JSON.stringify(todoList));
}

// Re-render todo list 
const renderList = (todoList) => {
  // Remove all cards
  tasksGrid.innerHTML = '';

  // Render todo list cards
  todoList.forEach((task, index) => {
    tasksGrid.appendChild(createCard(task.title, task.desc, task.isCompleted, index));
  });

  saveTodoList(todoList);
};

// Add a new task to todo list
const addTask = (title, desc) => {
  if (title && desc) {
    const updatedTodoList = [...getTodoList(), { title, desc, isCompleted: false }];

    renderList(updatedTodoList);
    viewAlert(createAlert('check-square', 'Task added to list successfully!', 'green'));
  } else {
    viewAlert(createAlert('exclamation-circle', 'Task Inputs cannot be empty!', 'red'));
  }
};

// Find task id And task card by event target element
const getTaskIdAndCard = (eventTarget) => {
  // Find task id
  const taskCard = eventTarget.closest('.todo-card');
  const id = taskCard.getAttribute('data-id');
  return [id, taskCard];
}

// Delete task
const deleteTask = (id) => {
  const todoList = getTodoList();
  // Delete task from the todoList array
  const updatedTodoList = todoList.filter((_, taskId) => taskId !== Number(id));

  renderList(updatedTodoList);
};

// Edit task
const editTask = (id) => {
  const todoList = getTodoList();

  // Show modal dialogue
  modalToggler();

  // Set task id as form data-id
  taskForm_edit.setAttribute('data-id', id);

  // Get task details
  taskTitle_edit.value = todoList[id].title;
  taskDesc_edit.value = todoList[id].desc;
};

// Change task status
const changeTaskStatus = (checkBox, taskCard, id) => {
  const todoList = getTodoList();

  // Get checkBox status
  const { checked } = checkBox.dataset;

  // Change checkbox status & task card style
  if (checked) {
    checkBox.classList.remove('bi-check-square-fill');
    checkBox.classList.add('bi-square');
    checkBox.removeAttribute('data-checked');

    // Change card style
    taskCard.classList.remove('done');

    // Update todoList array
    todoList[id].isCompleted = false;
  } else {
    checkBox.classList.remove('bi-square');
    checkBox.classList.add('bi-check-square-fill');
    checkBox.setAttribute('data-checked', 'true');

    // Change card style
    taskCard.classList.add('done');

    // Update todoList array
    todoList[id].isCompleted = true;
  }

  renderList(todoList);
};

// Task Card Functions
const createCard = (title, desc, isCompleted, id) => {
  // Create task card
  const card = document.createElement('article');
  card.classList.add('todo-card');
  if (isCompleted) card.classList.add('done')
  card.setAttribute('data-id', id);
  card.innerHTML = `
    <header>
        <div class="card-title">
        <h3>${title}</h3>
        </div>
        <div class="card-buttons">
            <i class="btn-check icon-checkbox ${isCompleted ? 'bi-check-square-fill' : 'bi-square'}" 
                ${isCompleted && 'data-checked="true"'}></i>
        </div>
    </header>
    <p class="card-body">${desc}</p>
    <footer>
        <button type="button" class="button button--primary btn-edit">
        <div class="button--icon-text">
            <i class="bi-pencil"></i>
            <span>Edit</span>
        </div>
        </button>
        <button type="button" class="button button--secondary btn-delete">
        <div class="button--icon-text">
            <i class="bi-trash"></i>
            <span>Delete</span>
        </div>
        </button>
    </footer>
    `;

  // Bind functions to the card buttons
  card.querySelector('.btn-check').onclick = handleStatusChange;
  card.querySelector('.btn-edit').onclick = handleEditTask;
  card.querySelector('.btn-delete').onclick = handleDeleteTask;
  return card;
};

// Event Listeners
// Get todo list data and render it after dom content loaded
window.addEventListener('DOMContentLoaded', (e) => {
  const todoList = getTodoList();
  renderList(todoList);
});

// Submit a new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskTitle.value, taskDesc.value);
});

// Edit a task
taskForm_edit.addEventListener('submit', (e) => {
  e.preventDefault();
  if (taskTitle_edit.value && taskDesc_edit.value) {
    const { id } = e.target.dataset;
    const todoList = getTodoList();
    todoList[id] = { ...todoList[id], title: taskTitle_edit.value, desc: taskDesc_edit.value };
    e.target.removeAttribute('data-id');
    modalToggler();
    renderList(todoList);
    viewAlert(createAlert('pencil', 'Task updated successfully!', 'green'));
  } else {
    viewAlert(createAlert('exclamation-circle', 'Task Inputs cannot be empty!', 'red'));
  }

})

// Toggle modal visibility status by clicking on it 
modal.addEventListener('click', modalToggler);

modalDialogue.addEventListener('click', (e) => e.stopPropagation());

modalDialogueCancelButton.addEventListener('click', modalToggler);