const currencyList = document.querySelectorAll(".converter__list select"),
  fromCurrency = document.querySelector(".converter__from select"),
  toCurrency = document.querySelector(".converter__to select"),
  button = document.querySelector("form button"),
  exchangeIcon = document.querySelector(".icon");

const APIKEY = "ae959c06aca072def08a8073";

for (let i = 0; i < currencyList.length; i++) {
  for (currency_code in country_code) {
    // Deixa Estados Unidos e Brasil selecionados de forma padrão.
    let selected;
    if (i === 0) {
      selected = currency_code === "USD" ? "selected" : "";
    } else if (i === 1) {
      selected = currency_code === "BRL" ? "selected" : "";
    }

    // Cria as opções de tag para conversão
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    // Inseri todas as opções de selecte no form
    currencyList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  currencyList[i].addEventListener("change", (event) => {
    loadFlag(event.target);
  });
}

function loadFlag(element) {
  for (code in country_code) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

button.addEventListener("click", (event) => {
  event.preventDefault();
  getExchangeRate();
});

exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  console.log(toCurrency, fromCurrency)
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".converter__amount input");
  const exchangeRateTxt = document.querySelector(".converter__rate");
  let amountValue = amount.value;
  if (amountValue == "" || amountValue == 0) {
    amount.value = 1;
    amountValue = 1;
  }
  exchangeRateTxt.innerText = "Obtendo a conversão atual...";
  let url = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/${fromCurrency.value}`;
  // faz o fecth para a API e depois transforma essa resposta em json, faz um novo then recebendo um objetos com os multiplicadores de conversão.
  fetch(url).then((response) => {
    response.json().then((response) => {
      let exchangeRate = response.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountValue * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountValue} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() => {
      exchangeRateTxt.innerText = "Algo deu errado... (API fora do AR)"
    })
  });
}
