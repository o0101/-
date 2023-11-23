class TodoItem extends $ {
  static get attrs() {
    return ['text', 'completed', 'index'];
  }

  constructor() {
    super({ editing: false, tempText: '' });
  }

  toggleComplete() {
    this.completed = !this.completed;
    return true;
  }

  startEditing() {
    this.state.editing = true;
    this.state.tempText = this.text;
  }

  finishOnEnter(keyup) {
    if ( keyup.key == 'Enter' ) {
      this.finishEditing();
    }
    return false;
  }

  finishEditing() {
    this.state.editing = false;
    this.text = this.state.tempText;
  }

  delete() {
    this.change('delete');
  }

  template() {
    const checkedClass = this.completed ? 'completed' : '';
    const editingClass = this.state.editing ? 'editing' : '';
    return `
      <li class="${checkedClass} ${editingClass}">
        <div ondblclick="startEditing">
          <input type="checkbox" ${this.completed ? 'checked' : ''} onclick="toggleComplete">
          <span>${this.text}</span>
        </div>
        <input type="text" value="${tempText}" onblur="finishEditing" onkeyup="finishOnEnter">
        <button onclick="delete">Delete</button>
      </li>
    `;
  }
}

TodoItem.link();

class TodoList extends $ {
  constructor() {
    super({ todos: [], filter: 'all' });
  }

  addTodo() {
    const text = this.shadow.querySelector('#new-todo').value;
    this.state.todos.push({ text, completed: false });
    return true;
  }

  deleteTodo(change) {
    if ( change.eventName == 'delete' ) {
      this.state.todos.splice(change.target.index, 1);
    }
    return true;
  }

  filterTodos(filter) {
    this.state.filter = filter;
    return true;
  }

  clearCompleted() {
    this.state.todos = this.state.todos.filter(todo => !todo.completed);
  }

  template() {
    const filteredTodos = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    return `
      <ul onchange=deleteTodo>
        ${filteredTodos.map((todo, index) => `
          <todo-item text="${todo.text}" completed="${todo.completed}" index=${index}></todo-item>
        `).join('')}
      </ul>
      <input type="text" id="new-todo" placeholder="Add a new task">
      <button onclick="addTodo">Add</button>
      <div>
        <button onclick="filterTodos('all')">All</button>
        <button onclick="filterTodos('active')">Active</button>
        <button onclick="filterTodos('completed')">Completed</button>
      </div>
      <button onclick="clearCompleted">Clear Completed</button>
    `;
  }
}

TodoList.link();

