const openForm = document.querySelector("#openFormReminder")
const formReminder = document.querySelector("#formReminder")

formReminder.addEventListener("submit", () => {alert("submit")})

openForm.addEventListener("click", () => {showForm(document.URL)})

const showForm = (URLink) => {
    
}