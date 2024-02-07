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
            reminderPluginMethods.deleteReminder(reminder.id)
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
    checkDataTimeFormat: (datetime) => {
        if (datetime < 10) {
            return `0${datetime}`
        } else {
            return `${datetime}`
        }
    },
    showForm: (URLink) => {
        reminderPluginConsts.inputURL.value = URLink
        const nowDatetime = new Date
        reminderPluginConsts.inputDate.value = `${reminderPluginMethods.checkDataTimeFormat(nowDatetime.getFullYear())}-${reminderPluginMethods.checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${reminderPluginMethods.checkDataTimeFormat(nowDatetime.getDate())}T${reminderPluginMethods.checkDataTimeFormat(nowDatetime.getHours())}:${reminderPluginMethods.checkDataTimeFormat(nowDatetime.getMinutes())}`
        reminderPluginConsts.formReminder.style = "display: flex"
        reminderPluginConsts.formReminderWrapper.style = "display: flex"
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
    initualizationTaskList: (taskList) => {
        console.log(taskList)
        for (let i = 0; i < taskList.length; i++) {
            reminderPluginMethods.showReminder(taskList[i])
        }
    },
    startSurveyServer: () => {
        if (reminderPluginConsts.flagFocus) {
            setTimeout(() => {
                fetch("https://raw.githubusercontent.com/danila-derenchenko/forApi/main/data.json").then(result => result.json()).then(result => reminderPluginMethods.initualizationTaskList(result)).finally(reminderPluginMethods.startSurveyServer())
            }, 10000)
        }
    }
}

/* Слушатели событий */

window.addEventListener('focus', () => {
    reminderPluginConsts.flagFocus = true
    reminderPluginMethods.startSurveyServer()
});
window.addEventListener('blur', () => {
    reminderPluginConsts.flagFocus = false
});

// Запуск опроса сервера
reminderPluginMethods.startSurveyServer()

reminderPluginConsts.formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    reminderPluginConsts.formReminderWrapper.style = "display: none"
    reminderPluginConsts.formReminder.style = "display: none"

    const data = {
        dateTime: reminderPluginMethods.toUTCTime(reminderPluginConsts.inputDate.value),
        URLaddres: reminderPluginConsts.inputURL.value,
        text: reminderPluginConsts.inputText.value
    }
    console.log(data)
    reminderPluginConsts.inputText.value = ""
    reminderPluginConsts.inputDate.value = ""
    reminderPluginMethods.sendTask(data)
})

openForm.addEventListener("click", () => { reminderPluginMethods.showForm(document.URL) })
closeForm.addEventListener("click", () => {
    reminderPluginConsts.formReminder.style = "display: none"
    reminderPluginConsts.formReminderWrapper.style = "display: none"
})

if (JSON.parse(localStorage.getItem("tasksList")) != null) {
    const tasksInitialization = JSON.parse(localStorage.getItem("tasksList"))
    for (let i = 0; i < tasksInitialization.length; i++) {
        reminderPluginMethods.showReminder(tasksInitialization[i])
    }
}