function createTodo(description, storage) {
  const container = document.querySelector('.todo__list');

  if (description) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo__item');

    const checkbox = createCheckbox();
    const label = createLabel(checkbox);
    const descriptionPara = createDescription(description);
    const removeImg = createRemoveImage();

    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    label.appendChild(descriptionPara);
    todoItem.appendChild(removeImg);
    container.appendChild(todoItem);

    popupDeadline(description, checkbox, storage);

    if (storage.length === 0) {
      renderFooter();
    } else {
      changeItemsFooter();
    }
  }
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 8);
}

function createCheckbox() {
  const checkbox = document.createElement('input');
  checkbox.classList.add('todo__done');
  checkbox.type = 'checkbox';
  checkbox.id = generateRandomId();

  return checkbox;
}

function createLabel(element) {
  const label = document.createElement('label');
  label.setAttribute('for', element.id);

  return label;
}

function createDescription(description) {
  const descriptionPara = document.createElement('p');
  descriptionPara.classList.add('todo__description');
  descriptionPara.textContent = description;

  return descriptionPara;
}

function createRemoveImage() {
  const removeImg = document.createElement('img');
  removeImg.classList.add('todo__remove');
  removeImg.src = './asset/img/basket.png';
  removeImg.alt = 'basket';

  return removeImg;
}

function setLocalStorage(data) {
  return localStorage.setItem('todoData', JSON.stringify(data));
}

function getLocalstorage() {
  return JSON.parse(localStorage.getItem('todoData')) || [];
}

function renderOldTodo() {
  const list = document.querySelector('.todo__list');
  const storage = getLocalstorage();

  if (storage.length > 0) {
    storage.forEach(({checkbox, description}, index) => {
      const todoItem = document.createElement('div');
      todoItem.classList.add('todo__item');

      const checkboxEl = createCheckbox();
      checkboxEl.id = storage[index].id;
      checkboxEl.checked = storage[index].checkbox;

      const label = createLabel(storage[index]);

      const descriptionPara = createDescription(description);
      const removeImg = createRemoveImage();

      label.appendChild(descriptionPara);
      todoItem.appendChild(checkboxEl);
      todoItem.appendChild(label);
      todoItem.appendChild(removeImg);

      list.appendChild(todoItem);
    });
  }
}

function addNewTodo(event) {
  event.preventDefault();
  const description = document.querySelector('.add__input').value.trim();
  const storage = getLocalstorage();

  createTodo(description, storage);
  event.target.reset();
}

function renderFooter() {
  const storage = getLocalstorage();
  const todo = document.querySelector(".todo");

  const footer = document.createElement('div');
  footer.classList.add('todo__footer');

  const items = document.createElement('div');
  items.classList.add('todo__footer-items');
  items.textContent = `${storage.length + 1} item`;

  const clear = document.createElement('button');
  clear.classList.add('todo__footer-clear');
  clear.textContent = 'Clear';

  footer.appendChild(items);
  footer.appendChild(clear);

  todo.appendChild(footer);
}

function changeItemsFooter() {
  const storage = getLocalstorage();
  const footer = document.querySelector('.todo__footer');
  const items = document.querySelector('.todo__footer-items');

  items.textContent = `${storage.length + 1} items`;

  if (storage.length < 1) {
    footer.remove();
  }
}

function deleteAllTodo() {
  const list = document.querySelector('.todo__list').children;
  const storage = getLocalstorage();
  storage.splice(0, storage.length);

  const items = [...list];
  items.forEach(item => item.remove())

  setLocalStorage(storage);
  changeItemsFooter();
}

function listenerList(elem) {

  elem.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('todo__done')) {
      const parent = document.querySelector('.todo__list');
      const targetItem = target.closest('.todo__item');
      const storage = getLocalstorage();
      const index = Array.from(parent.children).indexOf(targetItem);

      storage[index].checkbox = target.checked;

      target.parentNode.classList.remove('todo__item--alarm');

      setLocalStorage(storage);

    } else if (target.classList.contains('todo__remove')) {
      const index = Array.from(target.parentNode.parentNode.children).indexOf(target.parentNode);

      target.parentNode.remove();

      const storage = getLocalstorage();

      storage.splice(index, 1);
      setLocalStorage(storage);

      changeItemsFooter();

    } else if (target.classList.contains('todo__footer-clear')) {
      deleteAllTodo();
    }
  });
}

function popupDeadline(description, checkbox) {
  const todo = document.querySelector('.todo');
  const formDeadline = document.createElement('form');
  const inputDeadLine = document.createElement('input');
  const buttonDeadLine = document.createElement('button');
  const divDeadLine = document.createElement('div');

  divDeadLine.classList.add('popup')
  formDeadline.classList.add('add__todo', 'popupDeadline');

  inputDeadLine.classList.add('add__input', 'popupDeadline__input');
  inputDeadLine.type = 'number';
  inputDeadLine.setAttribute('min', '1');
  inputDeadLine.placeholder = 'How many hours to work?';

  buttonDeadLine.classList.add('add__button', 'popupDeadline__button');

  formDeadline.appendChild(inputDeadLine);
  formDeadline.appendChild(buttonDeadLine);
  divDeadLine.appendChild(formDeadline);
  document.body.insertBefore(divDeadLine, todo);
  inputDeadLine.focus();

  formDeadline.addEventListener('submit', (event) => {
    event.preventDefault();
    createObject(description, checkbox);

    divDeadLine.remove();
  });
}

function createObject(description, checkbox) {
  const storage = getLocalstorage();
  const limitTime = document.querySelector('.popupDeadline__input').value * 3600000;

  storage.push({
    checkbox: false,
    description: description,
    id: checkbox.id,
    time: new Date().getTime(),
    limit: limitTime,
  });

  setLocalStorage(storage);
}

function timer() {
  const storage = getLocalstorage();
  const nowHours = new Date().getTime();
  const todos = document.querySelectorAll('.todo__item');

  storage.forEach((todo, index) => {
    if (!todo.checkbox && nowHours - todo.time >= todo.limit) {
      todos[index].classList.add('todo__item--alarm');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.add__todo');
  const todo = document.querySelector('.todo');

  const storage = getLocalstorage();

  form.addEventListener('submit', addNewTodo);
  listenerList(todo)

  if (storage.length > 0) {
    renderOldTodo();
    renderFooter();
    timer();
  }

  setTimeout(timer, 60000);
})
