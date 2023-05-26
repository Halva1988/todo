class Todo {
  constructor(desc, container ='.todo__list') {
    this.desc = desc;
    this.constainer = document.querySelector(container)

    this.createTodo()
  }

  createTodo() {
    if (this.desc) {
      this.constainer.insertAdjacentHTML('beforeend', `
      <div class="todo__item">
        <input class="todo__done" type="checkbox">
        <p class="todo__description">${this.desc}</p>
        <img class="todo__remove" src="./asset/img/basket.png" alt="basket">
       </div>
      `);

      const remove = document.querySelector('.todo__remove');

      remove.addEventListener('click', event => {
        event.target.parentNode.remove()
      })
    }

  }
}

const form = document.querySelector('.add__todo');

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const desc = document.querySelector('.add__input').value;
  const item = new Todo(desc);
  event.target.reset();
})

