const span = document.createElement("span")
const cartDiv = document.querySelector("#cartDiv")
span.classList.add("span-cart")

function addToCart(e) {
    const selectLicense = e.target.parentNode.querySelector("select")
    const beat = beats.find(beat => beat.id === parseInt(e.target.id))
    const beatExist = beatsCart.find(beat => beat.id === parseInt(e.target.id))
    let optionsSelected = []
    if (beatExist) {
        Toastify({
            text: "Quantity increased of " + beatExist.name,
            duration: 2000,
            style: {
                background: "whitesmoke",
                color: "deeppink"
            }
        }).showToast()
        beatExist.quantity
        beatExist.quantity++
        beatExist.optionsSelected.push(selectLicense.value)
        console.log(beatExist.optionsSelected);
        updateCartBody()
    } else {
        const priceLicense = beat.price[selectLicense.value]
        optionsSelected.push(selectLicense.value)
        beatsCart.push({
            ...beat,
            selectedLicense: selectLicense.value,
            quantity: 1,
            priceLicense: priceLicense,
            optionsSelected: optionsSelected
        })
        Toastify({
            text: "Beat added to cart! " + beat.name,
            duration: 3000,
            style: {
                background: "blueviolet"
            },
            close: true
        }).showToast();
        updateCartBody()
    }
    renderCart()
    localStorage.setItem('beatsCart', JSON.stringify(beatsCart))
}

function renderCart() {
    if (beatsCart.length > 0) {
        span.innerText = beatsCart.length || ''
        span.style.display = 'flex'
        createSpanCart()
        
    } else {
        span.style.display = "none"
    }
}

function createSpanCart() {
    cartDiv.append(span)

}

function updateCartBody() {
    const offCanvasBody = document.querySelector("#cart-body")
    offCanvasBody.innerHTML = ""
    if (beatsCart.length === 0) {
        offCanvasBody.innerHTML = `<p>Comienza a añadir beats para sumar a tu carrito!</p>`
    } else {

        beatsCart.forEach(element => {
            const div = document.createElement("div")
            let options = ""
            let totalPrices = 0
            for (const license of element.optionsSelected) {
                options += `<option value="${license}">${license}</option>`
                totalPrices += element.price[license]
            }
            div.classList.add("card-cart")
            div.classList.add("d-flex")
            div.classList.add("flex-column")
            div.innerHTML = `
            <img src=${element.img} class="card-cart__img mw-100">
            <h2 class="card-cart__h2">${element.name}</h2>
            <h3 class="card-cart__h3">${element.category}</h3>
            <h3 class="card-cart__h3"><strong>Cantidad:</strong> ${element.quantity}</h3>
            <select>${options}</select>
            <p>TOTAL DE BEAT: U$D${totalPrices}</p>
            <button class="card-cart__btn-delete" data-id=${element.id}>DELETE BEAT</button>
            `
            offCanvasBody.append(div)
            const btnDelete = document.querySelectorAll(".card-cart__btn-delete")
            btnDelete.forEach((btn) => {
                btn.addEventListener("click", removeBeat)
            })
        });
        const btnEmpty = document.createElement("button")
        btnEmpty.innerText = "EMPTY CART"
        btnEmpty.classList.add("btn-empty-cart")
        offCanvasBody.appendChild(btnEmpty)
        btnEmpty.addEventListener("click", emptyCart)
    }
}


function removeBeat(e) {
    const beatDelete = beatsCart.find(beat => beat.id === parseInt(e.target.dataset.id))
    const index = beatsCart.indexOf(beatDelete)
    console.log(beatDelete);
    if (beatDelete) {
        const confirmar = confirm("Desea eliminar: " + beatDelete.name + "?")
        if (confirmar) {
            alert("Eliminado con exito.")
            beatsCart.splice(index, 1)
            localStorage.setItem('beatsCart', JSON.stringify(beatsCart))
            updateCartBody()
            renderCart()
        }
    }
}

function emptyCart() {
    if (beatsCart.length > 0) {
        const confirmar = confirm("Desea vaciar el carrito?")
        if (confirmar) {
            alert("El carrito fue vaciado.")
            beatsCart.splice(0, beatsCart.length)
            localStorage.setItem('beatsCart', JSON.stringify(beatsCart))
            updateCartBody()
            renderCart()
        }
    }
}

updateCartBody()
renderCart()