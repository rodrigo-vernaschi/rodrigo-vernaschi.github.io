// variáveis e seleção de eventos
const apiKey = "c24784a00335f3c62723286a4d90acd9";
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1280x720/?";

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

const loader = document.querySelector("#loader");

const backgroundImgBg = document.querySelector("#bg");
const backgroundImgDiv = document.querySelector("#background-img");

// funções
const toggleLoader = () => {
    loader.classList.toggle("hide");
};

const showCurrentLocation = async (lat, lon) => {
    hideInformation();
    toggleLoader();
    const currentPos = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(currentPos);
    const data = await res.json();

    showWeatherData(data.name);
    toggleLoader();
};

const getWeatherData = async (city) => {
    hideInformation();
    toggleLoader();
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    toggleLoader();
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

    // mudar imagem de fundo
    if (window.screen.width >= 600) {
        backgroundImgBg.setAttribute("src", `${apiUnsplash + city}`);
        backgroundImgDiv.classList.remove("hide");
    } else {
        backgroundImgDiv.classList.add("hide");
    }

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
    if (e.code === "Enter" || e.keyCode === 13) {
        let city = e.target.value;
        city = city.replace(/(^\s+|\s+$)/g, ""); // retira espaços em branco ao final da string

        showWeatherData(city);
    }
});

window.addEventListener("load", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        showCurrentLocation(lat, long);
    });
});

// ano atual (footer)
document.querySelector("#year").innerHTML = new Date().getFullYear();
