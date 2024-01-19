/* Запросы к серверу */

fetch('https://raw.githubusercontent.com/danila-derenchenko/forApi/main/data.json').then((res) => res.json()).then(rerult => console.log(rerult)).catch(() => console.error("Ошибка получения данных"))

/* Константы */

const openForm = document.querySelector("#openFormReminder")
const formReminder = document.getElementById("formReminder")
const inputURL = document.getElementById("formReminderURL")
const inputText = document.getElementById("formReminderText")
const inputDate = document.querySelector("#formReminderDate")
const formReminderWrapper = document.getElementById("formReminderWrapper")
const showReminder = document.getElementById("showReminder")

/* Логика */

showReminder.style = "display: none"
if(localStorage.getItem("countPages") == null || JSON.parse(localStorage.getItem("countPages")) <= 0) {
    localStorage.setItem("countPages", JSON.stringify(1))
} else {
    const countPages = JSON.parse(localStorage.getItem("countPages"))
    localStorage.setItem("countPages", JSON.stringify(countPages + 1))
}

/* Слушатели событий */

window.addEventListener("beforeunload", () => {
    localStorage.setItem("countPages", JSON.stringify(JSON.parse(localStorage.getItem("countPages")) - 1))
})

/* при событии submit данные о новой задаче добавляются в localhost */

formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    formReminderWrapper.style = "display: none"
    sendTask()
})

openForm.addEventListener("click", () => {showForm(document.URL)})

/* Функции */

const showForm = (URLink) => {
    inputURL.value = URLink
    const nowDatetime = new Date
    inputDate.value = `${checkDataTimeFormat(nowDatetime.getFullYear())}-${checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${checkDataTimeFormat(nowDatetime.getDate())}T${checkDataTimeFormat(nowDatetime.getHours())}:${checkDataTimeFormat(nowDatetime.getMinutes())}`
    formReminderWrapper.style = "display: flex"
}

const checkDataTimeFormat = (datetime) => {
    if(datetime < 10) {
        return `0${datetime}`
    } else {
        return `${datetime}`
    }
}

const sendTask = () => {
    const data = {
        dateTime: inputDate.value,
        URLaddres: inputURL.value,
        text: inputText.value
    }
    console.log(data)
    inputText.value = ""
    inputDate.value = ""
    if(localStorage.getItem("tasksList") != null) {
        let localstorageData = JSON.parse(localStorage.getItem("tasksList"))
        localstorageData.push(data)
        localStorage.setItem("tasksList", JSON.stringify(localstorageData))
    } else {
        localStorage.setItem("tasksList", JSON.stringify([data]))
    }
}