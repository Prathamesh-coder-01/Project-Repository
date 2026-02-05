const inputBox = document.getElementById("inputBox");
const listContainer = document.getElementById("list-container");

function addTask() {

    if (inputBox.value === '') {
        alert("Please write something!");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7"; // ×
    li.appendChild(span);

    inputBox.value = "";

    saveData();
}

/* Click events */
listContainer.addEventListener("click", function (e) {

    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    }

    else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }

}, false);


/* Save to localStorage */
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

/* Load data */
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();
