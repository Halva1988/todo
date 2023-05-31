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
      id: storage.length,
      time: new Date().getHours(),
    });

    setLocalStorage(storage);

    if (storage.length === 1) {
      renderFooter();
    } else {
      changeItemsFooter();
    }

    listenerList();
  }

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

      const footer = document.querySelector('.todo__footer');
      list.insertBefore(todoItem, footer);

    });

    changeItemsFooter();
  } else {
    list.innerHTML = '';
  }
}

function addNewTodo(event) {
  event.preventDefault();
  const description = document.querySelector('.add__input').value;
  const storage = getLocalstorage();

  createTodo(description, storage);
  event.target.reset();
}

function renderFooter() {
  const storage = getLocalstorage();
  const list = document.querySelector(".todo__list");

  const footer = document.createElement('div');
  footer.classList.add('todo__footer');

  const items = document.createElement('div');
  items.classList.add('todo__footer-items');
  items.textContent = `${storage.length} items`;

  const clear = document.createElement('button');
  clear.classList.add('todo__footer-clear');
  clear.textContent = 'Clear';

  footer.appendChild(items);
  footer.appendChild(clear);

  list.appendChild(footer);
}

function changeItemsFooter() {
  const storage = getLocalstorage();
  const footer = document.querySelector('.todo__footer');
  const items = document.querySelector('.todo__footer-items');

  items.textContent = `${storage.length} items`;

  if (storage.length < 1) {
    footer.remove();
  }
}

function deleteAllTodo() {
  const storage = getLocalstorage();
  storage.splice(0, storage.length);
  setLocalStorage(storage);
  renderOldTodo();
}

function listenerList() {
  const list = document.querySelector('.todo__list');

  list.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('todo__done')) {
      const index = target.id;
      const storage = getLocalstorage();
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
      const allChildren = list.children;

      for (let i = 0; i < allChildren.length; i++) {
        allChildren[i].remove();
      }

      deleteAllTodo();
    }
  });
}

function timer() {
  const storage = getLocalstorage();
  const nowHours = new Date().getHours();
  const todos = document.querySelectorAll('.todo__item')

  storage.forEach((todo, index) => {
    if (!todo.checkbox && nowHours - todo.time >= 5) {
      todos[index].classList.add('todo__item--alarm');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.add__todo');
  const storage = getLocalstorage();

  form.addEventListener('submit', addNewTodo);

  if (storage.length > 0) {
    renderFooter();
    renderOldTodo();
    listenerList();
    timer();
  }
})