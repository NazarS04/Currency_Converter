"use strict";

async function getCurrence(url) {
    try {
        const currencies = await fetch(url);
        const result = await currencies.json();

        result.sort((a, b) => {
            if (a.cc < b.cc) {
                return -1;
            }

            if (a.cc > b.cc) {
                return 1;
            }

            if (a.cc === b.cc) {
                return 0;
            }
        })

        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < selects.length; j++) {
                let option = document.createElement("option");
                option.value = result[i].rate;
                option.textContent = result[i].cc;

                selects[j].append(option);
            }
        }
    } catch (err) {
        const modalWindow = document.querySelector(".modalWindow");
        modalWindow.classList.add("modalWindow-open");
        modalWindow.querySelector("h1").addEventListener("selectstart", function (event) {
            event.preventDefault();
        })
        console.error(err);
    }
}

function swap(event) {
    if (selects[0].value === selects[1].value) {
        return;
    }

    let number = inputs[1].value;
    inputs[1].value = inputs[0].value;
    inputs[0].value = number;

    //-------------------------

    let currency = selects[1].value;
    selects[1].value = selects[0].value;
    selects[0].value = currency;
}

function selected() {
    if (selects[0].value !== selects[1].value) {
        if (inputs[0].disabled === true && selects[0].value !== "-1" && selects[1].value !== "-1") {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = false;
            }
        }

        return;
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
}

function inputSelection(event) {
    if (this.classList.contains("first-input")) {
        conversion.call(this, inputs[1], selects[0][selects[0].selectedIndex].value, selects[1][selects[1].selectedIndex].value);
    } else {
        conversion.call(this, inputs[0], selects[0][selects[0].selectedIndex].value, selects[1][selects[1].selectedIndex].value);
    }
}

function conversion(input, leftCurrency, rightCurrency) {
    input.value = Math.round(((this.value * leftCurrency) / rightCurrency) * 100) / 100;
}

function minusAndPlusDisabledInput(event) {
    if (event.code === "Equal" || event.code === "Minus" || event.code === "Comma") {
        event.preventDefault();
        return;
    }
}


let url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json";
let inputs = document.querySelectorAll(".fields__input");
let selects = document.querySelectorAll(".fields__select");
let arrow = document.querySelector(".arrow");

getCurrence(url);

for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener("change", selected)
}

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", inputSelection)
    inputs[i].addEventListener("keydown", minusAndPlusDisabledInput)
}

arrow.addEventListener("click", swap);