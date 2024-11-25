const BASE_URL =
  "https://api.currencyapi.com/v3/latest"; // Base URL without API key included

const API_KEY = "cur_live_mdVxzxPYn8phgHK5FmuBfXdqi5XrEDCZExM4Nj9i";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Fetch and update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Validate input value
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;

  try {
    // Fetch the data
    const response = await fetch(URL);

    // Check for errors in the response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    console.log("Response data:", data);

    // Extract exchange rate and calculate final amount
    const rate = data.data[toCurr.value].value;
    const finalAmount = (amtVal * rate).toFixed(2); // Round to 2 decimal places

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    // Handle errors (e.g., network issues, invalid response)
    console.error("Fetch error:", error.message);
    msg.innerText = `Error fetching exchange rate: ${error.message}`;
  }
};

// Update flag based on currency selection
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode]; // Ensure countryList is defined
  if (countryCode) {
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
  }
};

// Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form submission
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
