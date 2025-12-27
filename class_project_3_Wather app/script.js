const apiKey = "YOUR_API_KEY";

    function getWeather() {
        let city = document.getElementById("city").value;

        if (city === "") {
            alert("Enter city name");
            return;
        }

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {

                // Display data
                document.getElementById("cityName").innerText = data.name;
                document.getElementById("temperature").innerText =
                    "Temperature: " + data.main.temp + " °C";
                document.getElementById("humidity").innerText =
                    "Humidity: " + data.main.humidity + "%";
                document.getElementById("condition").innerText =
                    "Condition: " + data.weather[0].description;

                // Store data in localStorage
                let weatherData = {
                    city: data.name,
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    condition: data.weather[0].description
                };

                localStorage.setItem("weather", JSON.stringify(weatherData));
            })
            .catch(() => {
                alert("City not found");
            });
    }

    // Load stored data on page reload
    window.onload = function () {
        let storedData = localStorage.getItem("weather");

        if (storedData) {
            let data = JSON.parse(storedData);

            document.getElementById("city").value = data.city;
            document.getElementById("cityName").innerText = data.city;
            document.getElementById("temperature").innerText =
                "Temperature: " + data.temp + " °C";
            document.getElementById("humidity").innerText =
                "Humidity: " + data.humidity + "%";
            document.getElementById("condition").innerText =
                "Condition: " + data.condition;
        }
    };