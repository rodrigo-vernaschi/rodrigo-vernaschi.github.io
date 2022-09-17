const apiUnsplash = "https://source.unsplash.com/1366x768/?";
const apiIcon = "https://assets.hgbrasil.com/weather/images/";
let urlK = ""

const loader = document.querySelector("#loader");
const container = document.querySelector("#container");
const cityElement = document.querySelector("#city");
const dateElement = document.querySelector("#date");
const dayElement = document.querySelector("#day")
const tempElement = document.querySelectorAll("#temp");
const weatherIconElement = document.querySelector("#header-icon");
const todayMinTempElement = document.querySelectorAll("#forecast-min");
const todayMaxTempElement = document.querySelectorAll("#forecast-max");
const weatherBG = document.querySelector("#header-city-info");

// funções
const hideInformation = () => { 
    loader.classList.remove("hide");
    container.classList.add("hide");
};

const showInformation = () => {
    loader.classList.add("hide");
    container.classList.remove("hide");
};

const showBgImage = async (city) => {
    weatherBG.style.background = `linear-gradient(0deg, rgba(98, 84, 255, 0.5), rgba(89, 76, 238, 0.5)), url('${apiUnsplash}${city}')`;
    weatherBG.style.backgroundPosition = "center";
    weatherBG.style.backgroundSize = "cover";
};


const getCurrentIp = async () => {
    const currentUrl = window.location.href

    if(currentUrl.includes("127.0.0.1") || currentUrl.includes("192.168.0")) {
        urlK = "ee910e29"
    } else {
        urlK = "9801512a"
    }

    getWeatherData(urlK)
}

const getCurrentPos = (urlK) => {
    navigator.geolocation.getCurrentPosition(getCurrentLoc)

    function getCurrentLoc(position) {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        getWeatherData(lat, lon, urlK)
    }
}

const getWeatherData = async (lat, lon) => {

    const url = `https://api.hgbrasil.com/weather?key=${urlK}&array_limit=4&lat=${lat}&lon=${lon}&user_ip=remote&format=json-cors`;
    const res = await fetch(url);
    const data = await res.json();

    showBgImage(data.results.city_name);
    return showWeatherData(data);
};

const getDay = async (day, element) => {
    switch (day) {
        case 0:
            element.innerHTML = "<span>Domingo</span>"
            break;
        case 1:
            element.innerHTML = "<span>Segunda-Feira</span>"
            break;
        case 2:
            element.innerHTML = "<span>Terça-Feira</span>"
            break;
        case 3:
            element.innerHTML = "<span>Quarta-Feira</span>"
            break;
        case 4:
            element.innerHTML = "<span>Quinta-Feira</span>"
            break;
        case 5:
            element.innerHTML = "<span>Sexta-Feira</span>"
            break;
        case 6:
            element.innerHTML = "<span>Sábado</span>"
            break;
            
        default:
            break;
    }
}

const showWeatherData = async (city) => {
    hideInformation();

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }

        return i;
    }

    const data = await city;
    const forecastElements = data.results.forecast;
    const date = new Date();
    let day = date.getDay()
    let hours = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());
    let fullTime = `${hours}:${minutes}`;
    let originalCurrentWeatherIconName = data.results.condition_slug
    currentWeatherIconName = originalCurrentWeatherIconName.replace(/_/g, '-')
    
    weatherIconElement.setAttribute("src", "img/icons/" + currentWeatherIconName + ".svg");
    cityElement.innerText = data.results.city;
    dateElement.innerText = `${data.results.date} / ${fullTime}`;

    getDay(day, dayElement)

    for(let i = 0; i < tempElement.length; i++) {
        tempElement[i].innerText = data.results.temp;
    }
    
    for(let i = 0; i < tempElement.length; i++) {
        todayMinTempElement[i].innerText = data.results.forecast[0].min;
    }

    for(let i = 0; i < tempElement.length; i++) {
        todayMaxTempElement[i].innerText = data.results.forecast[0].max;
    }

    for (let i = 0; i < 4; i++) {

        if(day == 6) {
            day = 0
        } else {
            day++
        }

        const div = document.querySelector(".forecast-info");
        const originalIconName = data.results.forecast[i].condition
        const cardDescription = data.results.forecast[i].description
        iconName = originalIconName.replace(/_/g, '-')

        let cardDiv = document.createElement("div");
        let cardTextDiv = document.createElement("div");
        let cardIconDiv = document.createElement("div");
        let cardIcon = document.createElement("img");
        let pDate = document.createElement("p");
        let pDayOfWeek = document.createElement("p")
        let pMinTemp = document.createElement("p");
        let pMaxTemp = document.createElement("p");
        let pCardDescription = document.createElement("p")

        cardDiv.classList.add("forecast-card");
        cardTextDiv.classList.add("card-text");
        cardIconDiv.classList.add("card-icon");
        pDate.classList.add("forecast-date");
        pDayOfWeek.classList.add("forecast-day")
        pMinTemp.classList.add("forecast-minDate");
        pMaxTemp.classList.add("forecast-maxDate");
        pCardDescription.classList.add("card-temp-description")
        cardIcon.classList.add("card-icon");

        div.appendChild(cardDiv);

        cardDiv.appendChild(cardTextDiv);
        cardDiv.appendChild(cardIconDiv);

        cardTextDiv.appendChild(pDate);
        cardTextDiv.appendChild(pDayOfWeek);
        cardTextDiv.appendChild(pMinTemp);
        cardTextDiv.appendChild(pMaxTemp);
        cardTextDiv.appendChild(pCardDescription);
        
        cardIconDiv.appendChild(cardIcon);

        pDate.innerHTML = `<span>${forecastElements[i].date}</span>`;
        pMinTemp.innerHTML = `<span class="card-temps-text">Min: </span><span class="card-temp">${forecastElements[i].min} C&deg;</span>`;
        pMaxTemp.innerHTML = `<span class="card-temps-text">Max: </span><span class="card-temp">${forecastElements[i].max} C&deg;</span>`;
        pCardDescription.innerText = `${cardDescription}`;
        cardIcon.setAttribute("src", "img/icons/" + iconName + ".svg");

        getDay(day, pDayOfWeek)

    }

    

    showInformation();
};

// eventos
window.addEventListener("load", () => {
    getCurrentIp()
});

// ano atual (footer)
document.querySelector("#year").innerHTML = new Date().getFullYear();
