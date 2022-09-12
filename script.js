const todoList = [
  {
    title: 'Test',
    desc: 'This is a test.',
    isCompleted: false
  }
];

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

// UI Functions
const modalToggler = () => {
  modal.classList.toggle('show');
}

// Task List Functions
// Re-render todo list 
const loadList = () => {
  // Remove all cards
  tasksGrid.innerHTML = '';

  // Render todo list cards
  todoList.forEach((task, index) => {
    tasksGrid.appendChild(createCard(task.title, task.desc, task.isCompleted, index));
  });
};

// Add a new task to todo list
const addTask = (title, desc) => {
  if (title && desc) {
    todoList.push({ title, desc, isCompleted: false });
    loadList();
  }
};

// Delete task
const deleteTask = (e) => {
  // Find task id
  const taskCard = e.target.closest('.todo-card');
  const id = taskCard.getAttribute('data-id');

  // Delete task from the todoList array
  todoList.splice(id, 1);
  loadList();
};

// Edit task
const editTask = (e) => {
  // Find task id
  const taskCard = e.target.closest('.todo-card');
  const id = taskCard.getAttribute('data-id');

  // Show modal dialogue
  modalToggler();

  // Set task id as form data-id
  taskForm_edit.setAttribute('data-id', id);

  // Get task details
  taskTitle_edit.value = todoList[id].title;
  taskDesc_edit.value = todoList[id].desc;
};

// Change task status
const changeTaskStatus = (e) => {
  // Get checkBox status
  const target = e.target;
  const { checked } = target.dataset;

  // Find task id
  const taskCard = target.closest('.todo-card');
  const id = taskCard.getAttribute('data-id');

  // Change checkbox status & task card style
  if (checked) {
    target.classList.remove('bi-check-square-fill');
    target.classList.add('bi-square');
    target.removeAttribute('data-checked');

    // Change card style
    taskCard.classList.remove('done');

    // Update todoList array
    todoList[id].isCompleted = false;
  } else {
    target.classList.remove('bi-square');
    target.classList.add('bi-check-square-fill');
    target.setAttribute('data-checked', 'true');

    // Change card style
    taskCard.classList.add('done');

    // Update todoList array
    todoList[id].isCompleted = true;
  }
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
  card.querySelector('.btn-check').onclick = changeTaskStatus;
  card.querySelector('.btn-edit').onclick = editTask;
  card.querySelector('.btn-delete').onclick = deleteTask;
  return card;
};

// Event Listeners
document.body.onload = loadList;

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskTitle.value, taskDesc.value);
});

taskForm_edit.addEventListener('submit', (e) => {
  e.preventDefault();
  const { id } = e.target.dataset;
  todoList[id] = { ...todoList[id], title: taskTitle_edit.value, desc: taskDesc_edit.value };
  e.target.removeAttribute('data-id');
  modalToggler();
  loadList();
})

modal.addEventListener('click', modalToggler);

modalDialogue.addEventListener('click', (e) => e.stopPropagation());

modalDialogueCancelButton.addEventListener('click', modalToggler);