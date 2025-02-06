let currentTaskElement = null;
const body = document.body;
const themeSwitch = document.getElementById("theme-switch");

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById("task");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const li = createTaskElement(taskText);
    document.getElementById("task-list").appendChild(li);
    saveTasks();
    taskInput.value = "";
}

function createTaskElement(text) {
    const li = document.createElement("li");
    li.classList.add("task");
    li.innerHTML = `
        <span onclick="toggleComplete(this)">
            <svg class="task-added" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>
            <svg class="task-done" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="m419-407-98-98q-9-9-21-9t-21 9q-9 9-9 21.5t9 21.5l119 120q9 9 21 9t21-9l247-248q9-9 9-21t-9-21q-9-9-21.5-9t-21.5 9L419-407ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Z"/></svg>
            <span class="task-text">
                ${text}
            </span>
        </span>
        <div class="actions">
            <button class="edit" onclick="openModal(this)">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M150-120q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm589-577 40-40-41-41-40 40 41 41Z"/></svg>
            </button>
            <button class="delete" onclick="removeTask(this)">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-11q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h158q0-13 8.63-21.5 8.62-8.5 21.37-8.5h204q12.75 0 21.38 8.62Q612-822.75 612-810h158q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5h-11v570q0 24.75-17.62 42.37Q723.75-120 699-120H261Zm136.18-146q12.82 0 21.32-8.63 8.5-8.62 8.5-21.37v-339q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v339q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63Zm166 0q12.82 0 21.32-8.63 8.5-8.62 8.5-21.37v-339q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v339q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63Z"/></svg>
            </button>
        </div>
    `;
    return li;
}

function removeTask(button) {
    button.parentElement.parentElement.remove();
}

function openModal(button) {
    const li = button.parentElement.parentElement;
    const span = li.querySelector(".task-text");

    let taskText = span.textContent;

    taskText = taskText.trim().replace(/\s+/g, ' ');

    document.getElementById("editTaskInput").value = taskText;
    currentTaskElement = span;
    const modal = document.getElementById("editModal");
    modal.style.display = "flex"; // Garante que o modal aparece antes da animação
    setTimeout(() =>  modal.classList.remove("hidden"), 10);
}

function closeModal() {
    const modal = document.getElementById("editModal");
    modal.classList.add("hidden");

    setTimeout(() => {
        modal.style.display = "none"; // Só esconde após a animação
    }, 300);
}

function saveEdit() {
    const newText = document.getElementById("editTaskInput").value.trim();
    if (newText !== "" && currentTaskElement) {
        currentTaskElement.textContent = newText;
        saveTasks();
    }
    closeModal();
}

function toggleComplete(span) {
    span.parentElement.classList.toggle("completed");
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-list .task").forEach(task => {
        tasks.push({
            text: task.querySelector("span").textContent,
            completed: task.classList.contains("completed")
        })
    })
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const li = createTaskElement(task.text);
        if (task.completed) {
            li.classList.add("completed");
        }
        document.getElementById("task-list").appendChild(li);
    });
}

themeSwitch.addEventListener("click", () => {
    body.classList.toggle("darkmode");

    if (body.classList.contains("darkmode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("darkmode");
}
