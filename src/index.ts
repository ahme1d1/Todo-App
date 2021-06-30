import { TodoItem } from "./todoItem";
import { TodoCollection } from "./todoCollection";
import * as inquirer from 'inquirer';
import { JsonTodoCollection } from "./jsonTodoCollection";

let todos = [
    new TodoItem(1, "Buy Flowers"),
    new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"), 
    new TodoItem(4, "Call Joe", true)
];

let collection = new JsonTodoCollection("Adam", todos);
let showCompleted = true;

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List `
    + `(${ collection.getIncompleteItemsCounts().incomplete } items to do)`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
    Add = "Add New Task",
    Complete = "Complete Task",
    Remove = "Remove Complete Task",
    Toggle = "Show/Hide Completed",
    Quit = "Quit"
}

function PromptShowAndHideCompletedTasks(): void {
    showCompleted = !showCompleted;
    promptUser();
}

function PromptAddTask(): void {
    console.clear();
    inquirer.prompt({
        type: "input",
        name: "add",
        message: "Ennter task: "
    }).then((answers) => {
        if (answers["add"] != "") {
            collection.addTodo(answers["add"])
        }
        promptUser();
    })
}

function PromptCompleteTask(): void {
    console.clear();
    inquirer.prompt({
        type: "checkbox",
        name: "complete",
        message: "Mark Tasks Complete",
        choices: collection.getTodoItems(showCompleted).map((item) => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    }).then((answers) => {
        let completeTasks = answers["complete"] as number[];
        collection.getTodoItems(true).forEach((item) => {
            const findCompletedTasks = completeTasks.find(id => id === item.id) != undefined;
            collection.markComplete(item.id, findCompletedTasks)
        })
        promptUser();
    })
}

function PromptRemoveComplete(): void {
    collection.removeComplete();
    promptUser();
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands),
        // badProperty: true
    }).then(answers => {
        switch(answers["command"]) {
            case Commands.Toggle:
                PromptShowAndHideCompletedTasks();
                break;
            case Commands.Add:
                PromptAddTask();
                break;
            case Commands.Complete:
                PromptCompleteTask();
                break;
            case Commands.Remove:
                PromptRemoveComplete();
                break;
        }
    })
}

promptUser();