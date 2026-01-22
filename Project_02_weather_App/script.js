const apikey = "940780323231f6ca999541d96f5cbc2e"; // <-- IMPORTANT (see note below)
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const response = await fetch(apiurl + city + `&appid=${apikey}`);
    const data = await response.json();

    // ❌ Handle API errors safely
    if (!response.ok) {
        alert(data.message);
        return;
    }

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
        Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML =
        data.main.humidity + "%";
    document.querySelector(".wind").innerHTML =
        data.wind.speed + " km/h";

    const weather = data.weather[0].main;

    if (weather === "Clouds") {
        weatherIcon.src = "images/clouds.png";
    } else if (weather === "Clear") {
        weatherIcon.src = "images/clear.png";
    } else if (weather === "Rain") {
        weatherIcon.src = "images/rain.png";
    } else if (weather === "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
    } else if (weather === "Mist") {
        weatherIcon.src = "images/mist.png";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value.trim());
    }
});
