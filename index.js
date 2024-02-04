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
    console.log("Task send sucsessfully")
    console.log(task)
}

const startSurveyServer = () => {
    let flag = true
    window.addEventListener('focus', () => {
        flag = true
      });
    window.addEventListener('blur', () => {
        flag = false
      });
    setInterval(() => {
        if(flag) {
            fetch("ya.ru")
        }
    }, 10000)
}

/* const initualizationTaskList = (taskList) => {
    console.log(taskList)
    for(let i = 0; i < taskList.length; i++) {
        addTask(taskList[i])
    }
} */

/* Слушатели событий */

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
    sendTask(data)
})

openForm.addEventListener("click", () => {showForm(document.URL)})

startSurveyServer()