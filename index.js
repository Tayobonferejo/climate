
const weatherIcons = {

  // Clear / Cloud
  0: "images/icon-sunny.webp",           // Clear sky
  1: "images/icon-partly-cloudy.webp",  // Mainly clear
  2: "images/icon-partly-cloudy.webp",  // Partly cloudy
  3: "images/icon-overcast.webp",       // Overcast

  // Fog
  45: "images/icon-fog.webp",
  48: "images/icon-fog.webp",

  // Drizzle
  51: "images/icon-drizzle.webp",
  53: "images/icon-drizzle.webp",
  55: "images/icon-drizzle.webp",

  // Rain
  61: "images/icon-rain.webp",
  63: "images/icon-rain.webp",
  65: "images/icon-rain.webp",

  // Snow
  71: "images/icon-snow.webp",
  73: "images/icon-snow.webp",
  75: "images/icon-snow.webp",

  // Thunderstorm
  95: "images/icon-storm.webp",
  96: "images/icon-storm.webp",
  99: "images/icon-storm.webp"

};


const main = document.getElementById("main");
const form = document.getElementById("form");
const readInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");
let weatherCreated = false;


window.addEventListener("DOMContentLoaded", () => {
  const lat = 7.2570;
  const lon = 5.2058;
  gettingWeather(lat, lon);
});


form.addEventListener("submit", fetchWeather)

async function fetchWeather(event) {

    event.preventDefault()
    const lat = readInput.dataset.lat;
    const lon = readInput.dataset.lon;

      if (!lat || !lon) {
      console.log("Please select a city from the suggestions");
      return;
    }

    gettingWeather(lat, lon);

}


readInput.addEventListener("keyup", displayCity);

function displayCity() {

  if(readInput.value.length > 0) {
    readInput.style.backgroundImage = "none";
  }
  else {
    readInput.style.backgroundImage = "url(./images/icon-search.svg)";
  }

 const query = readInput.value.trim();

  // stop if input is too short
  if (query.length < 3) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.border = "none"
    return;
  }

  else {
    suggestionsBox.style.border = "1px solid #ddd"
  }

  fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&apiKey=30643b9cbac2483bbd31ee40d73a7b5a`)
    .then(response => response.json())
    .then(data => {
      suggestionsBox.innerHTML = "";

      data.features.forEach(item => {
        const city = item.properties.city || item.properties.name;
        const country = item.properties.country;

        const li = document.createElement("li");
        li.textContent = `${city}, ${country}`;

        li.addEventListener("click", () => {
          readInput.value = `${city}, ${country}`

          readInput.dataset.lat = item.properties.lat;
          readInput.dataset.lon = item.properties.lon;
          suggestionsBox.innerHTML = "";
        });

        suggestionsBox.appendChild(li);
      });
    })
    .catch(err => console.error(err));
}


function showingTemp (currentTemp) {


    document.getElementById("temp").textContent =
    `${currentTemp.temperature_2m}°C`;

    document.getElementById("humidity").textContent =
      `Humidity: ${currentTemp.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
      `Wind: ${currentTemp.wind_speed_10m} km/h`;

    document.getElementById("rain").textContent =
      `Rain: ${currentTemp.precipitation} mm`;

    document.getElementById("feel").textContent =
    `Feels like ${Math.round(currentTemp.apparent_temperature)}°C`


}

async function gettingWeather(lat, lon) {

  createWeatherUI();

  try {

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature&hourly=temperature_2m,precipitation,weather_code&&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Africa/Lagos`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const dataPoint = await response.json();

    const currentTemp = dataPoint.current;

    showingTemp(currentTemp);
    displayHourly(dataPoint.hourly);
    displayDaily(dataPoint.daily);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createWeatherUI() {

  if (weatherCreated) return;

  const contentRow = document.createElement("div");
  contentRow.className = "content-row";


  // LEFT SECTION
  const leftSection = document.createElement("div");
  leftSection.className = "left-section";

  leftSection.innerHTML = `

    <div class="weather-main-card">
        <h2 id="temp">--</h2>
    </div>

    <div class="tempValue">
        <p id="feel"></p>
        <p id="humidity"></p>
        <p id="wind"></p>
        <p id="rain"></p>
    </div>

    <h3 class="daily-title">Daily Forecast</h3>
    <div id="daily-container" class="daily-grid"></div>

  `;


  // RIGHT SECTION (Hourly only)
  const rightSection = document.createElement("div");

  rightSection.className = "right-section";

  rightSection.innerHTML = `
      <h3>Hourly Forecast</h3>
      <div id="hourly-container"></div>
  `;


  contentRow.appendChild(leftSection);
  contentRow.appendChild(rightSection);

  main.appendChild(contentRow);

  weatherCreated = true;
}

function displayHourly(hourlyData) {

  const container = document.getElementById("hourly-container");
  container.innerHTML = "";

  const now = new Date();

  let count = 0;

  for (let i = 0; i < hourlyData.time.length; i++) {

    const hourTime = new Date(hourlyData.time[i]);

    if (hourTime >= now && count < 8) {

      const hour = hourTime.getHours();

      const div = document.createElement("div");

      div.className = "hour-item";

      const code = hourlyData.weather_code[i];

      const icon = weatherIcons[code] || "images/icon-sunny.webp";

      div.innerHTML = `
        <div class="iconDiv">
          <img src="${icon}" class="weather-icon">
          <p>${hour}:00</p>
        </div>
        <p>${Math.round(hourlyData.temperature_2m[i])}°C</p>
      `;

      container.appendChild(div);

      count++;

    }

  }

}

function displayDaily(dailyData) {

  const container = document.getElementById("daily-container");

  container.innerHTML = "";

  for (let i = 0; i < dailyData.time.length; i++) {

    const date = new Date(dailyData.time[i]);

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const card = document.createElement("div");

    card.className = "daily-card";

    const code = dailyData.weather_code[i];

    const icon = weatherIcons[code] || "images/icon-sunny.webp";

    card.innerHTML = `
      <p>${dayName}</p>
      <img src="${icon}" class="daily-icon">
      <p>
        ${Math.round(dailyData.temperature_2m_max[i])}° /
        ${Math.round(dailyData.temperature_2m_min[i])}°
      </p>
    `;

    container.appendChild(card);

  }

} 
