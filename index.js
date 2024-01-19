/* Константы */

const openForm = document.querySelector("#openFormReminder")
const formReminder = document.getElementById("formReminder")
const inputURL = document.getElementById("formReminderURL")
const inputText = document.getElementById("formReminderText")
const inputDate = document.querySelector("#formReminderDate")
const formReminderWrapper = document.getElementById("formReminderWrapper")

/* Логика */

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

formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    formReminderWrapper.style = "display: none"
    const data = JSON.stringify({
        dateTime: inputDate.value,
        URLaddres: inputURL.value,
        text: inputText.value
    })
    console.log(data)
    inputText.value = ""
    inputDate.value = ""
})

openForm.addEventListener("click", () => {showForm(document.URL)})

/* Функции */

const showForm = (URLink) => {
    inputURL.value = URLink
    const nowDatetime = new Date
    inputDate.value = `${checkDataTimeFormat(nowDatetime.getFullYear())}-${checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${checkDataTimeFormat(nowDatetime.getDate())}T${checkDataTimeFormat(nowDatetime.getHours())}:${checkDataTimeFormat(nowDatetime.getMinutes())}`
    console.log(`${checkDataTimeFormat(nowDatetime.getFullYear())}-${checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${checkDataTimeFormat(nowDatetime.getDate())}T${checkDataTimeFormat(nowDatetime.getHours() + 1)}:${checkDataTimeFormat(nowDatetime.getMinutes())}`)
    formReminderWrapper.style = "display: flex"
}

const checkDataTimeFormat = (datetime) => {
    if(datetime < 10) {
        return `0${datetime}`
    } else {
        return `${datetime}`
    }
}