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
            time: new Date().getTime(),
        });

        setLocalStorage(storage);

        if (storage.length === 1) {
            renderFooter();
        } else {
            changeItemsFooter();
        }
    }
}

function createCheckbox() {
    const storage = getLocalstorage();
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

            const checkboxEl = createCheckbox();
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
    items.textContent = `${storage.length} ${storage.length === 1 ? "item" : "items"}`;

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

    items.textContent = `${storage.length} items`;

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
            const storage = getLocalstorage();
            const index = target.id;
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

function timer() {
    const storage = getLocalstorage();
    const nowHours = new Date().getTime();
    const todos = document.querySelectorAll('.todo__item');

    storage.forEach((todo, index) => {
        if (!todo.checkbox && nowHours - todo.time >= 3600000) {
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
