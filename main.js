// main.js

// 1. 必要な要素を取得
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// --- localStorageの操作

// 保存されるタスクを配列で取得する
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// タスクの配列をlocalStorageに保存する
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// DOMの操作

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id; // タスクを識別するIDをli要素に持たせる
  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="delete-btn">削除</button>
  `;

  if (task.done) li.classList.add("done");

  li.querySelector(".task-text").addEventListener("click", () => {
    li.classList.toggle("done");
    toggleDone(task.id); // localStorageも更新
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    deleteTask(task.id); // localStorageも更新
  });

  taskList.appendChild(li);
}

// --- localStrageの更新 ---

function toggleDone(id) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === Number(id));
  task.done = !task.done;
  saveTasks(tasks);
}

// タスクを削除する
function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== Number(id));
  saveTasks(tasks);
}
// --- タスク追加 ---

function addTask(text) {
  const task = {
    id: Date.now(),
    text: text,
    done: false,
  };
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  addTaskToDOM(task);
}

// --- イベントリスナー
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return; // 空欄なら何もしない
  addTask(text);
  taskInput.value = ""; // 入力欄をリセット
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

// --- 初期化:ページ読み込み時にlocalStorageからタスクを復元
getTasks().forEach((task) => addTaskToDOM(task));

// --- フィルター ---
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // アクティブなボタンの見た目を切り替える
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // フォルターの種類を取得
    const filter = btn.dataset.filter;

    // タスクの表示/非表示を切り替える
    document.querySelectorAll("#task-list li").forEach((li) => {
      if (filter === "all") {
        li.style.display = "";
      } else if (filter === "active") {
        li.style.display = li.classList.contains("done") ? "none" : "";
      } else if (filter === "done") {
        li.style.display = li.classList.contains("done") ? "" : "none";
      }
    });
  });
});
