/* Константы и переменные */

const openForm = document.querySelector("#openFormReminder")
const closeForm = document.querySelector("#closeFormReminder")
const formReminder = document.getElementById("formReminder")
const inputURL = document.getElementById("formReminderURL")
const inputText = document.getElementById("formReminderText")
const inputDate = document.querySelector("#formReminderDate")
const formReminderWrapper = document.getElementById("formReminderWrapper")
let flagFocus = true

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
    if(localStorage.getItem("tasksList") != null) {
        let localstorageData = JSON.parse(localStorage.getItem("tasksList"))
        localstorageData.push(reminder)
        localStorage.setItem("tasksList", JSON.stringify(localstorageData))
    } else {
        localStorage.setItem("tasksList", JSON.stringify([reminder]))
    }
    formReminderWrapper.insertAdjacentHTML("afterbegin", `
    <a href="${reminder.URLaddres}" target="_blank" id="reminder${reminder.id}" class="showReminder">
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
        const remindersList = JSON.parse(localStorage.getItem("tasksList")) || []
        let flag = true
        if(remindersList.length != 0) {
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
        }
    })
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

const sendTask = (task) => {
    // здесь задача уходит на сервер
    fetch("", {
        method: "POST",
        body: JSON.stringify(task)
    })
}

const toUTCTime = (time) => {
    const toUTC = new Date(time)
    return `${toUTC.getUTCFullYear()}-${toUTC.getUTCMonth()}-${toUTC.getUTCDate()}T${toUTC.getUTCHours()}:${toUTC.getUTCMinutes()}`
}

const startSurveyServer = () => {
    if(flagFocus) {
        setTimeout(() => {
            fetch("https://raw.githubusercontent.com/danila-derenchenko/forApi/main/data.json").then(result => result.json()).then(result => initualizationTaskList(result)).finally(startSurveyServer())
        }, 10000)
    }
}

const initualizationTaskList = (taskList) => {
    console.log(taskList)
    for(let i = 0; i < taskList.length; i++) {
        showReminder(taskList[i])
    }
}

/* Слушатели событий */

window.addEventListener('focus', () => {
    flagFocus = true
    startSurveyServer()
});
window.addEventListener('blur', () => {
    flagFocus = false
});

// Запуск опроса сервера
startSurveyServer()

formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    formReminderWrapper.style = "display: none"
    formReminder.style = "display: none"

    const data = {
        dateTime: toUTCTime(inputDate.value),
        URLaddres: inputURL.value,
        text: inputText.value
    }
    console.log(data)
    inputText.value = ""
    inputDate.value = ""
    sendTask(data)
})

openForm.addEventListener("click", () => {showForm(document.URL)})
closeForm.addEventListener("click", () => {
    formReminder.style = "display: none"
    formReminderWrapper.style = "display: none"
})

if(JSON.parse(localStorage.getItem("tasksList")) != null) {
    const tasksInitialization = JSON.parse(localStorage.getItem("tasksList"))
    for(let i = 0; i < tasksInitialization.length; i++) {
        showReminder(tasksInitialization[i])
    }
}