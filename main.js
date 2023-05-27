function createTodo(description, storage) {
  const container = document.querySelector('.todo__list');

  if (description) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo__item');

    const checkbox = createCheckbox(storage);
    const label = createLabel(storage);
    const descriptionPara = createDescription(description);
    const removeImg = createRemoveImage();

    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    label.appendChild(descriptionPara);
    todoItem.appendChild(removeImg);
    container.appendChild(todoItem);

    storage.push({
      checkbox: false,
      description: description,
      id: storage.length
    });
  }

  setLocalStorage(storage);
}

function createCheckbox(storage) {
  const checkbox = document.createElement('input');
  checkbox.classList.add('todo__done');
  checkbox.type = 'checkbox';
  checkbox.id = storage.length;

  return checkbox;
}

function createLabel(storage) {
  const label = document.createElement('label');
  label.setAttribute('for', storage.length);

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
  return localStorage.setItem('todoData', JSON.stringify(data))
}

function getLocalstorage() {
  return JSON.parse(localStorage.getItem('todoData')) || [];
}

function renderOldTodo() {
  const list = document.querySelector('.todo__list');
  list.innerHTML = '';
  const storage = getLocalstorage();

  storage.forEach(({ checkbox, description }, index) => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo__item');

    const checkboxEl = document.createElement('input');
    checkboxEl.classList.add('todo__done');
    checkboxEl.type = 'checkbox';
    checkboxEl.id = index;
    checkboxEl.checked = checkbox;

    const label = document.createElement('label');
    label.setAttribute('for', index);

    const descriptionPara = createDescription(description);
    const removeImg = createRemoveImage();

    label.appendChild(descriptionPara);
    todoItem.appendChild(checkboxEl);
    todoItem.appendChild(label);
    todoItem.appendChild(removeImg);

    list.appendChild(todoItem);
  });

  list.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('todo__done')) {
      const index = target.id;
      const storage = getLocalstorage();
      storage[index].checkbox = target.checked;

      setLocalStorage(storage);
    } else if (target.classList.contains('todo__remove')) {
      const index = Array.from(target.parentNode.parentNode.children).indexOf(target.parentNode);

      target.parentNode.remove();

      const storage = getLocalstorage();

      storage.splice(index, 1);
      setLocalStorage(storage);
    }
  });
}

function addNewTodo(event) {
  event.preventDefault();
  const description = document.querySelector('.add__input').value;
  const storage = getLocalstorage();

  createTodo(description, storage);
  event.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.add__todo');
  form.addEventListener('submit', addNewTodo);

  renderOldTodo();
})