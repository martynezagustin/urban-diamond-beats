const beatContainer = document.getElementById("beats-container")
const dropdownMenu = document.querySelector(".dropdown-menu")
const loadingSpan = document.querySelector(".loading-span")
let beats = []
let beatsCart = JSON.parse(localStorage.getItem('beatsCart')) || []

function executeLoading() {
    loadingSpan.style.color = "deeppink"
    setInterval(() => {
        if (loadingSpan.style.color == "deeppink") {
            loadingSpan.style.color = "whitesmoke"
        } else {
            loadingSpan.style.color = "deeppink"
        }
    }, 500);
}

function generateBeats() {
    clearContent()
    setTimeout(() => {
        getApi("./json/beats.json")
            .then(data => data.json())
            .then(data => {
                beats = data
                generateCategories(beats)
                generateAllBeats()
                showAllCategories()
                setTimeout(() => {
                    Toastify({
                        text: "To add beats to cart, click on the respective 'add to cart' buttons.",
                        duration: 3000,
                        style: {
                            background: "blueviolet",
                            color: "lightpink"
                        },
                        close: true
                        }).showToast();
                }, 3000);
            })
            .catch(() => {
                const divResult = document.querySelector(".divResult")
                const errorTitle = document.createElement("h2")
                errorTitle.innerText = "Ha ocurrido un error, vuelve a intentarlo más tarde."
                errorTitle.style.color = "crimson"
                divResult.append(errorTitle)
                loadingSpan.style.display = 'none'
            })
    }, 6000);
}

function showAllCategories() {
    const li = document.createElement("li")
    const btnGenerateAllCategories = document.createElement("a")
    btnGenerateAllCategories.classList.add("dropdown-item")
    btnGenerateAllCategories.innerText = "Show all categories"
    li.appendChild(btnGenerateAllCategories)
    dropdownMenu.appendChild(li)
    btnGenerateAllCategories.addEventListener("click", () => {
        generateAllBeats()
    })
}

function generateAllBeats() {
    clearContent()
    beats.forEach((beat) => {
        let options = "" //variable con string vacio
        for (const licenseType in beat.price) {
            options += `<option value="${licenseType}">${licenseType}: <strong>U$D</strong> ${beat.price[licenseType]}</option>`
        }
        const divisor = document.createElement("div")
        divisor.classList.add("beat-container__div")
        divisor.innerHTML = `<img src=${beat.img} alt=${beat.name} class="beat-container__div-img">
<div>
<h3 class="beat-container__div-h3">${beat.name}</h3>
<h4 class = "beat-container__div-h4">${beat.category}</h4>
<h4>Elegir licencia: </h4>
<div">
<select>${options}</select>
<button class="beat-container__add-to-cart" id=${beat.id}>ADD TO CART 🛒</button>
</div>
</div>
`
beatContainer.appendChild(divisor)
loadingSpan.style.display = 'none'
        const btnAdd = document.querySelectorAll(".beat-container__add-to-cart")
        btnAdd.forEach((btn) => {
            btn.addEventListener("click", addToCart)
        })
    })
}

function generateCategories(beats) {
    dropdownMenu.innerHTML = ""
    //generate categories
    const categories = beats.map((beat) => beat.category)
    const categoriesData = [...new Set(categories)]
    console.log(categoriesData)
    categoriesData.forEach((category) => {
        const li = document.createElement("li")
        const anchor = document.createElement("a")
        anchor.classList.add("dropdown-item")
        anchor.innerText = category
        li.appendChild(anchor)
        dropdownMenu.appendChild(li)
        anchor.addEventListener("click", () => {
            filterByCategories(category, beats)
        })
    })
}

function filterByCategories(category, beats) {
    clearContent()
    const categoryFilter = beats.filter((beat) => beat.category === category)
    if (categoryFilter.length > 0) {
        categoryFilter.forEach((beat) => {
            let options = "" //variable con string vacio
            for (const licenseType in beat.price) {
                options += `<option value="${licenseType}">${licenseType}: <strong>U$D</strong> ${beat.price[licenseType]}</option>`
            }
            const divisor = document.createElement("div")
            divisor.classList.add("beat-container__div")
            divisor.innerHTML = `<img src=${beat.img} alt=${beat.name} class="beat-container__div-img">
            <div>
            <h3 class="beat-container__div-h3">${beat.name}</h3>
            <h4 class = "beat-container__div-h4">${beat.category}</h4>
            <h4>Elegir licencia: </h4>
            <div">
            <select>${options}</select>
            <button class="beat-container__add-to-cart" id=${beat.id}>ADD TO CART 🛒</button>
            </div>
            </div>
            `
            beatContainer.appendChild(divisor)
            loadingSpan.style.display = 'none'
            const btnAdd = document.querySelectorAll(".beat-container__add-to-cart")
            btnAdd.forEach((btn) => {
                btn.addEventListener("click", addToCart)
            })
        })
    }
}

function getApi(url) {
    return fetch(url)
}

function clearContent() {
    while (beatContainer.firstChild) {
        beatContainer.removeChild(beatContainer.firstChild)
    }
}

generateBeats()
executeLoading()
