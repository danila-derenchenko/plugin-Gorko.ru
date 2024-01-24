/* Константы и переменные */

const openForm = document.querySelector("#openFormReminder")
const formReminder = document.getElementById("formReminder")
const inputURL = document.getElementById("formReminderURL")
const inputText = document.getElementById("formReminderText")
const inputDate = document.querySelector("#formReminderDate")
const formReminderWrapper = document.getElementById("formReminderWrapper")

/* Функции */

const deleteReminder = (reminderId) => {
    const remindersList = JSON.parse(localStorage.getItem("tasksList"))
    let newRemindersList = []
    for(let i = 0; i < remindersList.length; i++) {
        if(remindersList[i].id != reminderId) {
            newRemindersList.push(remindersList[i])
        }
    }
    if(newRemindersList.length == 0) {
        formReminderWrapper.style = "display: none"
    }
    localStorage.setItem("tasksList", JSON.stringify(newRemindersList))
}

const showReminder = (reminder) => {
    formReminderWrapper.insertAdjacentHTML("afterbegin", `
    <a href="${reminder.URLaddres}" id="reminder${reminder.id}" class="showReminder">
        <p class="reminderIntro">НАПОМИНАНИЕ</p>
        <p id="textReminder" class="reminderText">${reminder.text}</p>
    </a>
`)
    formReminderWrapper.style = "display: flex"
    const reminderClick = document.getElementById(`reminder${reminder.id}`)
    reminderClick.addEventListener("click", () => {
        reminderClick.remove()
        deleteReminder(reminder.id)
    })
    addEventListener("storage", () => {
        const remindersList = JSON.parse(localStorage.getItem("tasksList"))
        let flag = true
        for(let i = 0; i < remindersList.length; i++) {
            if(remindersList[i].id == reminder.id) {
                flag = false
            }
        }
        if(flag) {
            reminderClick.remove()
        }
        if(remindersList.length == 0) {
            formReminderWrapper.style = "display: none"
        }
    })
}

const addTimerTask = (task) => {
    const nowDateTime = new Date
    const nowTime = new Date(`${checkDataTimeFormat(nowDateTime.getFullYear())}-${checkDataTimeFormat(nowDateTime.getMonth() + 1)}-${checkDataTimeFormat(nowDateTime.getDate())}T${checkDataTimeFormat(nowDateTime.getHours())}:${checkDataTimeFormat(nowDateTime.getMinutes())}`)
    const taskTime = new Date(task.dateTime)
    console.log(taskTime - nowTime)
    setTimeout(() => {showReminder(task)}, taskTime - nowTime)
}

const showForm = (URLink) => {
    inputURL.value = URLink
    const nowDatetime = new Date
    inputDate.value = `${checkDataTimeFormat(nowDatetime.getFullYear())}-${checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${checkDataTimeFormat(nowDatetime.getDate())}T${checkDataTimeFormat(nowDatetime.getHours())}:${checkDataTimeFormat(nowDatetime.getMinutes())}`
    formReminder.style = "display: flex"
    formReminderWrapper.style = "display: flex"
}

const checkDataTimeFormat = (datetime) => {
    if(datetime < 10) {
        return `0${datetime}`
    } else {
        return `${datetime}`
    }
}

const addTask = (task) => {
    console.log(task)
    addTimerTask(task)
    if(localStorage.getItem("tasksList") != null) {
        let localstorageData = JSON.parse(localStorage.getItem("tasksList"))
        localstorageData.push(task)
        localStorage.setItem("tasksList", JSON.stringify(localstorageData))
    } else {
        localStorage.setItem("tasksList", JSON.stringify([task]))
    }
}

const initualizationTaskList = (taskList) => {
    console.log(taskList)
    for(let i = 0; i < taskList.length; i++) {
        addTask(taskList[i])
    }
}

/* Слушатели событий */

window.addEventListener("beforeunload", () => {
    if((JSON.parse(localStorage.getItem("countPages")) - 1) == 0) {
        localStorage.setItem("countPages", JSON.stringify(JSON.parse(localStorage.getItem("countPages")) - 1))
        localStorage.setItem("tasksList", JSON.stringify([]))
        localStorage.setItem("loadedReminder", JSON.parse(false))
    } else {
        localStorage.setItem("countPages", JSON.stringify(JSON.parse(localStorage.getItem("countPages")) - 1))
    }
})

window.addEventListener("DOMContentLoaded", () => {
    // Проверка количества открытых вкладок
    if(localStorage.getItem("countPages") == null || JSON.parse(localStorage.getItem("countPages")) <= 0) {
        localStorage.setItem("countPages", JSON.stringify(1))
    } else {
    const countPages = JSON.parse(localStorage.getItem("countPages"))
    localStorage.setItem("countPages", JSON.stringify(countPages + 1))
}
})

/* при событии submit данные о новой задаче добавляются в localhost */

formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    formReminderWrapper.style = "display: none"
    formReminder.style = "display: none"
    const data = {
        dateTime: inputDate.value,
        URLaddres: inputURL.value,
        text: inputText.value
    }
    console.log(data)
    inputText.value = ""
    inputDate.value = ""
    addTask(data)
})

openForm.addEventListener("click", () => {showForm(document.URL)})

// Логика

// Проверка загрузки напоминаний с сервера на других вкладках
if(localStorage.getItem("loadedReminder") == null || JSON.parse(localStorage.getItem("loadedReminder")) == false) {
    localStorage.setItem("loadedReminder", JSON.stringify(true))
    // Получение уже созданных задач, и установка таймеров
    fetch('https://raw.githubusercontent.com/danila-derenchenko/forApi/main/data.json').then((res) => res.json()).then(result => {
        initualizationTaskList(result)
    }).catch(() => console.error("Ошибка получения данных"))
} else {
    for(let i = 0; i < JSON.parse(localStorage.getItem("tasksList")).length; i++) {
        addTimerTask(JSON.parse(localStorage.getItem("tasksList"))[i])
    }
}