
document.addEventListener("DOMContentLoaded", function () {
    initializeAutocomplete();
});

// 🔍 Search Weather by City
document.getElementById("searchBtn").addEventListener("click", function () {
    let city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch weather data.");
            return response.json();
        })
        .then(data => updateWeatherUI(data))
        .catch(error => console.error("Error fetching weather data:", error));
});

// 📍 Get Weather by Geolocation
document.getElementById("getLocationBtn").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            fetch(`/weather/coords?lat=${lat}&lon=${lon}`)
                .then(response => {
                    if (!response.ok) throw new Error("Failed to fetch location weather.");
                    return response.json();
                })
                .then(data => updateWeatherUI(data))
                .catch(error => console.error("Error fetching location weather:", error));
        }, error => {
            alert("Geolocation error: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// 🌦️ Update Weather UI
function updateWeatherUI(data) {
    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("temperature").innerText = `${data.main.temp}°C`;
    document.getElementById("feelsLike").innerText = `${data.main.feels_like}°C`;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("windSpeed").innerText = `${data.wind.speed} km/h`;
    document.getElementById("condition").innerText = data.weather[0].description;

    document.querySelector(".weather-info").style.display = "flex";
}

// ✅ Improved Autocomplete Feature with Geoapify
const cityInput = document.getElementById("cityInput");
const suggestionBox = document.createElement("div");
suggestionBox.setAttribute("id", "suggestionBox");
cityInput.parentNode.appendChild(suggestionBox);

suggestionBox.style.position = "absolute";
suggestionBox.style.background = "#fff";
suggestionBox.style.border = "1px solid #ccc";
suggestionBox.style.width = cityInput.offsetWidth + "px";
suggestionBox.style.display = "none";
suggestionBox.style.zIndex = "1000";
suggestionBox.style.maxHeight = "150px";
suggestionBox.style.overflowY = "auto";
suggestionBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
suggestionBox.style.borderRadius = "4px";

cityInput.addEventListener("input", function () {
    let input = this.value.trim();
    if (input.length < 2) {
        suggestionBox.style.display = "none";
        return;
    }

    fetch(`/autocomplete?query=${input}`)
        .then(response => response.json())
        .then(data => {
            suggestionBox.innerHTML = "";
            if (data.features && data.features.length > 0) {
                suggestionBox.style.display = "block";
                suggestionBox.style.left = cityInput.offsetLeft + "px";
                suggestionBox.style.top = (cityInput.offsetTop + cityInput.offsetHeight) + "px";
                suggestionBox.style.width = cityInput.offsetWidth + "px";

                data.features.forEach(place => {
                    let suggestionItem = document.createElement("div");
                    suggestionItem.innerText = place.properties.formatted;
                    suggestionItem.style.padding = "8px";
                    suggestionItem.style.cursor = "pointer";
                    suggestionItem.style.borderBottom = "1px solid #ddd";
                    suggestionItem.style.fontSize = "16px";
                    suggestionItem.style.color = "black";

                    suggestionItem.addEventListener("mouseover", function () {
                        suggestionItem.style.backgroundColor = "#f1f1f1";
                    });
                    suggestionItem.addEventListener("mouseout", function () {
                        suggestionItem.style.backgroundColor = "white";
                    });

                    suggestionItem.addEventListener("click", function () {
                        cityInput.value = place.properties.formatted;
                        suggestionBox.style.display = "none";
                    });

                    suggestionBox.appendChild(suggestionItem);
                });
            } else {
                suggestionBox.style.display = "none";
            }
        })
        .catch(error => console.error("Error fetching autocomplete suggestions:", error));
});

document.addEventListener("click", function (event) {
    if (!suggestionBox.contains(event.target) && event.target !== cityInput) {
        suggestionBox.style.display = "none";
    }
});



