/* Константы */

const openForm = document.querySelector("#openFormReminder")
const formReminder = document.querySelector("#formReminder")
const inputURL = document.getElementById("formReminderURL")
const inputText = document.getElementById("formReminderText")
const inputDate = document.querySelector("#formReminderDate")
const formReminderWrapper = document.getElementById("formReminderWrapper")

formReminder.addEventListener("submit", (event) => {
    event.preventDefault()
    formReminderWrapper.style = "display: none"
    sendTask()
})

openForm.addEventListener("click", () => {showForm(document.URL)})

const showForm = (URLink) => {
    formReminderWrapper.style = "display: flex"
    inputURL.value = URLink
    const nowDatetime = new Date
    inputDate.value = `${checkDataTimeFormat(nowDatetime.getFullYear())}-${checkDataTimeFormat(nowDatetime.getMonth() + 1)}-${checkDataTimeFormat(nowDatetime.getDate())}T${checkDataTimeFormat(nowDatetime.getHours() + 1)}:${checkDataTimeFormat(nowDatetime.getMinutes())}`
    console.log(inputDate.value)
}

const sendTask = () => {
    const data = JSON.stringify({
        dateTime: inputDate.value,
        URLaddres: inputURL.value,
        text: inputText.value
    })
    console.log(data)
    inputText.value = ""
    inputDate.value = ""
}

const checkDataTimeFormat = (datetime) => {
    if(datetime < 10) {
        return `0${datetime}`
    } else {
        return `${datetime}`
    }
}