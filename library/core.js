/*
/
/
    ==== Todo Application by Agbafor Olisa Emmanuel From Genesys Tech Hub @ Learnable2020 =====
/
 */
// global variable declarations
var todos = [];
var list = document.getElementById('list');
var input = document.getElementById('input');
var add_todo = document.getElementById('add-todo');
var clear_todo = document.getElementById('clear-todo');
var message_box = document.getElementById('message-box');

// Object Declaration!
var Todo = {
    // todo properties
  name : '',
  id : 0,

    // method for new todo
  createTodo : function (todo_item) {
    this.name = todo_item;
    todos.push({name : this.name, id : this.id});
    this.id++;
    this.saveToStorage();
    return this.fetchAllTodos();
  },


    // method to save todo to localStorage
    saveToStorage : function () {
      localStorage.setItem("ToDo", JSON.stringify(todos));
  },


    // Method to Fetch all todo from the localstorage
  fetchAllTodos : function () {
    let todo_json = localStorage.getItem('ToDo');
    if (!todo_json) {
        todos = [];
        message_box.innerHTML = "<span style='color: blue'> <strong>Info! :</strong> You have no Todo in the List </span>";
        list.innerHTML = "";
        return;
    }
      todos = JSON.parse(todo_json);
      this.loadTodo(todos);
      this.id = todos.length;
  },


    // method to load the fetched todo
    loadTodo : function (items) {
        list.innerHTML = "";
        items.forEach(function (item) {
            Todo.displayTodo(item.id, item.name)
        });
    },


    // method to display the todo in their html format
    displayTodo : function (id, todo) {
        const todo_item_tag = "<li id=" + id + " class='list-group-item'>" +
            "<div class='list-group-item-action'><span>" + todo + "</span>" +
            "<button class='btn btn-danger btn-sm float-right mx-2' data-action='delete' >delete</button> " +
            "<button class='btn btn-primary btn-sm float-right' data-action='edit' >edit</button></div>" +
            "</li>";
        const position = "afterbegin";
        list.insertAdjacentHTML(position,todo_item_tag);
    },


    // method to update edited todo
    updateTodo : function (id, todo) {
        todos[id].name = todo;
        this.saveToStorage();
        return this.fetchAllTodos();
    },


    // method to delete a todo
    deleteTodo : function (index) {
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === parseInt(index)) {
                todos.splice(i, 1);
            }
        }
        this.saveToStorage();
        return this.fetchAllTodos();
    },


    // method to clear all todo from the storage
    clearStorage : function () {
        localStorage.clear();
        return this.fetchAllTodos();
    }

};


// ==== functions for the event listeners ==== //

// event to load todo from the storage upon window load
window.addEventListener("load", function () {
    Todo.fetchAllTodos();
});


// click event captured on the list element
list.addEventListener("click", function (event) {
    let action = event.target.dataset.action;
    let index = event.path[2].id;
    if (action === 'delete') {
        Todo.deleteTodo(index);
        message_box.innerHTML= "<span style='color: green'> <strong>Success!</strong> The todo was deleted successfully </span>";
    } else if (action === 'edit') {
        add_todo.innerText = "Update Todo";
        add_todo.setAttribute("data-index", index);
        input.value = event.path[1].children[0].innerText;
    }
});


// event to clear all todo from storage
clear_todo.addEventListener("click", function () {
    Todo.clearStorage();
});

// event captured on the button in the form against adding or updating
add_todo.addEventListener("click", function (event) {
    let input_value = input.value;
    if (!input_value){
        message_box.innerHTML= "<span style='color: red'> <strong>Error! </strong> Your todo must have a name </span>";
        return ;
    }
    let index = event.target.dataset.index;
    if (index) {
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === parseInt(index)) {
                Todo.updateTodo(i, input_value);
            }
        }
        add_todo.removeAttribute('data-index');
        add_todo.innerText = "Add Todo";
        input.value = "";
        message_box.innerHTML= "<span style='color: blue'> <strong>Info!</strong> Your todo was edited successfully </span>";
        return;
    }
    Todo.createTodo(input.value);
    message_box.innerHTML= "<span style='color: green'> <strong>Success! </strong> Your todo has been added </span>";
    input.value = "";
});
