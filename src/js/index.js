import "../scss/styles.scss";

//Generador de IDs
import { nanoid } from "nanoid";

//Variables globales
const d = document;
let colorTask = "";
let currentDate = "";

//Establece atributo de fecha min en input Date
const minDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month =
    today.getMonth() + 1 > 9
      ? today.getMonth() + 1
      : `0${today.getMonth() + 1}`;
  const day = today.getDate() + 1 > 9 ? today.getDate() : `0${today.getDate()}`;
  const minDate = `${year}-${month}-${day}`;
  currentDate = minDate;
  const $date = d.getElementById("date");
  $date.setAttribute("min", minDate);
};

//Obtención fecha completa
const getDateFull = (countDownDate) => {
  let now = new Date().getTime(),
    limitTime = countDownDate - now,
    days = Math.floor(limitTime / (1000 * 60 * 60 * 24)),
    hours = (
      "0" + Math.floor((limitTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).slice(-2),
    minutes = (
      "0" + Math.floor((limitTime % (1000 * 60 * 60)) / (1000 * 60))
    ).slice(-2),
    seconds = ("0" + Math.floor((limitTime % (1000 * 60)) / 1000)).slice(-2);

  return [days, hours, minutes, seconds, limitTime];
};

//Inicio del contador
const initCount = (count) => {
  const $countDown = d.querySelectorAll(count);
  $countDown.forEach((c) => {
    console.log();
    const countDownDate = new Date(c.getAttribute("data-fech")).getTime();
    const [days, hours, minutes, seconds, limitTime] = getDateFull(countDownDate);

    if (limitTime > 0) {
      c.innerHTML = `<h3 class="countDown">Faltan: ${days} días ${hours} horas ${minutes} minutos ${seconds} segundos</h3>`;
    } else {
      c.innerHTML = `<h3>Ya llegó la hora!!</h3>`;
    }
  });
};

//Establece un temporizador en cada tarea
const countDown = () => {
  const $countDown = d.querySelectorAll(".count");
  initCount(".count");
  $countDown.forEach((c) => {
    console.log();
    const countDownDate = new Date(c.getAttribute("data-fech")).getTime();
    let countDownTempo = setInterval(() => {
      const [days, hours, minutes, seconds, limitTime] = getDateFull(
        countDownDate
      );

      c.innerHTML = `<h3 class="countDown">Faltan: ${days} días ${hours} horas ${minutes} minutos ${seconds} segundos</h3>`;

      if (limitTime < 0) {
        clearInterval(countDownTempo);
        c.innerHTML = `<h3>Ya llegó la hora!!</h3>`;
      }
    }, 1000);
  });
};

//Reenderiza tareas del localStorage
const renderTasks = () => {
  const fragment = d.createDocumentFragment();
  const $listTask = d.querySelector(".list-tasks");
  $listTask.innerHTML = "";
  for (let index = 0; index < localStorage.length; index++) {
    if (localStorage.key(index) !== "loglevel:webpack-dev-server") {
      const $div = d.createElement("div");
      $div.classList.add("task-container");
      let key = localStorage.key(index);
      const task = JSON.parse(localStorage.getItem(key));
      $div.classList.add(`${task.color}`);
      $div.innerHTML = `
        <h3>${task.name}</h3>
       <div class="count-container">
        <div class="count" data-fech="${task.date}">
        <h3 class="countDown">Faltan: '' días '' horas '' minutos '' segundos</h3>
        </div>
        <div class="close" data-id="${task.id}">&#x2716;</div>
       </div>
      `;
      fragment.appendChild($div);
    }
  }
  $listTask.appendChild(fragment);
  countDown();
};

//Seleciona Color nueva tarea
const setColorTask = (btns) => {
  const $btns = d.querySelectorAll(btns);
  d.addEventListener("click", (e) => {
    if (e.target.matches(btns)) {
      $btns.forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      colorTask = e.target.value;
    }
  });
};

//Elimina Tarea de localstorage
const removeTask = (task) => {
  d.addEventListener("click", (e) => {
    if (e.target.matches(task)) {
      console.log(e.target.dataset.id);
      localStorage.removeItem(e.target.dataset.id);
      renderTasks();
    }
  });
};

//Reseteo formulario
const resetForm = (form) => {
  form.task.value = "";
  form.date.value = "";
  colorTask = "";
  const $btns = d.querySelectorAll(".btn-color");
  $btns.forEach((btn) => {
    btn.classList.remove("active");
  });
};

//Guarda nueva tarea en localStorage
const submitForm = (form) => {
  const $form = d.getElementById(form);
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      e.target.task.value !== "" &&
      e.target.date.value !== "" &&
      colorTask !== "" &&
      e.target.date.value >= currentDate
    ) {
      if (e.target === $form) {
        const newTask = {
          id: nanoid(),
          name: e.target.task.value,
          color: colorTask,
          date: e.target.date.value,
        };
        localStorage.setItem(newTask.id, JSON.stringify(newTask));
        renderTasks();
        resetForm($form);
      }
    } else {
      $form.classList.add("error");
      setTimeout(() => {
        $form.classList.remove("error");
      }, 3000);
    }
  });
};

//Inicio app a la carga del DOM
d.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  minDate();
  setColorTask(".btn-color");
  submitForm("form-tasks");
  removeTask(".close");
});
