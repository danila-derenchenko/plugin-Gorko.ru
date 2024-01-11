const openForm = document.querySelector("#openFormReminder")
const formReminder = document.querySelector("#formReminder")
const inputURL = document.getElementById("formReminderURL")
const formReminderWrapper = document.getElementById("formReminderWrapper")

formReminder.addEventListener("submit", () => {alert("submit")})

openForm.addEventListener("click", () => {showForm(document.URL)})

const showForm = (URLink) => {
    inputURL.value = document.URL
    formReminderWrapper.style = "display:flex"
}