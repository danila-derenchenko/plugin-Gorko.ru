let reminderPluginConsts = {
    /* Константы и переменные */
    openForm: document.querySelector("#openFormReminder"),
    closeForm: document.querySelector("#closeFormReminder"),
    formReminder: document.getElementById("formReminder"),
    inputURL: document.getElementById("formReminderURL"),
    inputText: document.getElementById("formReminderText"),
    inputDate: document.querySelector("#formReminderDate"),
    formReminderWrapper: document.getElementById("formReminderWrapper"),
    flagFocus: true
}

// Переделать функции под работу с объектом

let reminderPluginMethods = {
    /* Функции */
    deleteReminder: (reminderId) => {
        const remindersList = JSON.parse(localStorage.getItem("tasksList"))
        let newRemindersList = []
        for (let i = 0; i < remindersList.length; i++) {
            if (remindersList[i].id != reminderId) {
                newRemindersList.push(remindersList[i])
            }
        }
        if (newRemindersList.length == 0) {
            reminderPluginConsts.formReminderWrapper.style = "display: none"
        }
        localStorage.setItem("tasksList", JSON.stringify(newRemindersList))
    },
    showReminder: (reminder) => {
        if (localStorage.getItem("tasksList") != null) {
            let localstorageData = JSON.parse(localStorage.getItem("tasksList"))
            localstorageData.push(reminder)
            localStorage.setItem("tasksList", JSON.stringify(localstorageData))
        } else {
            localStorage.setItem("tasksList", JSON.stringify([reminder]))
        }
        reminderPluginConsts.formReminderWrapper.insertAdjacentHTML("afterbegin", `
        <a href="${reminder.URLaddres}" target="_blank" id="reminder${reminder.id}" class="showReminder">
            <p class="reminderIntro">НАПОМИНАНИЕ</p>
            <p id="textReminder" class="reminderText">${reminder.text}</p>
        </a>
    `)
        reminderPluginConsts.formReminderWrapper.style = "display: flex"
        const reminderClick = document.getElementById(`reminder${reminder.id}`)
        reminderClick.addEventListener("click", () => {
            reminderClick.remove()
            deleteReminder(reminder.id)
        })
        addEventListener("storage", () => {
            const remindersList = JSON.parse(localStorage.getItem("tasksList")) || []
            let flag = true
            if (remindersList.length != 0) {
                for (let i = 0; i < remindersList.length; i++) {
                    if (remindersList[i].id == reminder.id) {
                        flag = false
                    }
                }
                if (flag) {
                    reminderClick.remove()
                }
                if (remindersList.length == 0) {
                    reminderPluginConsts.formReminderWrapper.style = "display: none"
                }
            }
        })
    },
    showForm: (URLink) => {
        reminderPluginConsts.inputURL.value = URLink
        const nowDatetime = new Date
        reminderPluginConsts.inputDate.value = `${checkDataTimeFormat(nowDatetime.getFullYear())}-${checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${checkDataTimeFormat(nowDatetime.getDate())}T${checkDataTimeFormat(nowDatetime.getHours())}:${checkDataTimeFormat(nowDatetime.getMinutes())}`
        reminderPluginConsts.formReminder.style = "display: flex"
        reminderPluginConsts.formReminderWrapper.style = "display: flex"
    },
    checkDataTimeFormat: (datetime) => {
        if (datetime < 10) {
            return `0${datetime}`
        } else {
            return `${datetime}`
        }
    },
    sendTask: (task) => {
        // здесь задача уходит на сервер
        fetch("", {
            method: "POST",
            body: JSON.stringify(task)
        })
    },
    toUTCTime: (time) => {
        const toUTC = new Date(time)
        return `${toUTC.getUTCFullYear()}-${toUTC.getUTCMonth()}-${toUTC.getUTCDate()}T${toUTC.getUTCHours()}:${toUTC.getUTCMinutes()}`
    },
    startSurveyServer: () => {
        if (reminderPluginConsts.flagFocus) {
            setTimeout(() => {
                fetch("https://raw.githubusercontent.com/danila-derenchenko/forApi/main/data.json").then(result => result.json()).then(result => initualizationTaskList(result)).finally(startSurveyServer())
            }, 10000)
        }
    },
    initualizationTaskList: (taskList) => {
        console.log(taskList)
        for (let i = 0; i < taskList.length; i++) {
            showReminder(taskList[i])
        }
    }
}

/* Слушатели событий */

window.addEventListener('focus', () => {
    reminderPluginConsts.flagFocus = true
    startSurveyServer()
});
window.addEventListener('blur', () => {
    reminderPluginConsts.flagFocus = false
});

// Запуск опроса сервера
startSurveyServer()

reminderPluginConsts.formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    reminderPluginConsts.formReminderWrapper.style = "display: none"
    reminderPluginConsts.formReminder.style = "display: none"

    const data = {
        dateTime: toUTCTime(reminderPluginConsts.inputDate.value),
        URLaddres: reminderPluginConsts.inputURL.value,
        text: reminderPluginConsts.inputText.value
    }
    console.log(data)
    reminderPluginConsts.inputText.value = ""
    reminderPluginConsts.inputDate.value = ""
    sendTask(data)
})

openForm.addEventListener("click", () => { showForm(document.URL) })
closeForm.addEventListener("click", () => {
    reminderPluginConsts.formReminder.style = "display: none"
    reminderPluginConsts.formReminderWrapper.style = "display: none"
})

if (JSON.parse(localStorage.getItem("tasksList")) != null) {
    const tasksInitialization = JSON.parse(localStorage.getItem("tasksList"))
    for (let i = 0; i < tasksInitialization.length; i++) {
        showReminder(tasksInitialization[i])
    }
}