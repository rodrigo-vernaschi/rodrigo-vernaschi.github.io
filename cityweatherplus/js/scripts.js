// variáveis e seleção de eventos
const apiKey = "c24784a00335f3c62723286a4d90acd9";
const apiCountryURL = "https://countryflagsapi.com/png/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const currentPositionBtn = document.querySelector("#currentPosition-btn");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const minTemp = document.querySelector("#minSpan");
const maxTemp = document.querySelector("#maxSpan");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");

// funções
const showCurrentLocation = async (lat, lon) => {
    const currentPos = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(currentPos);
    const data = await res.json();

    showWeatherData(data.name);
};

const getWeatherData = async (city) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    return data;
};

const showErrorMessage = () => {
    errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
    weatherContainer.classList.add("hide");
    errorMessageContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
    hideInformation();

    const data = await getWeatherData(city);

    if (data.cod === "404") {
        showErrorMessage();
        return;
    }

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute("src", `img/icons/${data.weather[0].icon}.svg`);
    countryElement.setAttribute("src", apiCountryURL + data.sys.country);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}km/h`;
    minTemp.innerText = parseInt(data.main.temp_min);
    maxTemp.innerText = parseInt(data.main.temp_max);

    weatherContainer.classList.remove("hide");
};

// eventos
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const city = cityInput.value;

    showWeatherData(city);
});

currentPositionBtn.addEventListener("click", (e) => {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        showCurrentLocation(lat, long);
    });
});

cityInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value;

        showWeatherData(city);
    }
});

window.addEventListener("load", (e) => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        showCurrentLocation(lat, long);
    });
});

// ano atual (footer)
document.querySelector("#year").innerHTML = new Date().getFullYear();
