
const main = document.getElementById("main");
const form = document.getElementById("form");
const readInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");


window.addEventListener("load", function (){
  const lat = 6.90;
  const lon = 6.90;
  gettingWeather(lat, lon);

})

form.addEventListener("submit", fetchWeather)

async function fetchWeather(event) {

    event.preventDefault()
    const lat = readInput.dataset.lat;
    const lon = readInput.dataset.lon;

      if (!lat || !lon) {
      console.log("Please select a city from the suggestions");
      return;
    }

    gettingWeather();

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
    `Feel: ${parseInt(currentTemp.temperature_2m) + parseInt(currentTemp.relative_humidity_2m)/100}mm`;


}
async function gettingWeather (lat, lon) {
  try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=Africa/Lagos`);

          if(!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const dataPoint = await response.json();
          console.log(dataPoint);

          const outputValue = document.createElement("div");
          outputValue.classList.add("weather");
          main.appendChild(outputValue);
          outputValue.innerHTML = `
                <div>
                    <h2 id="temp"></h2>
                </div>
                <div class="tempValue">
                    <p id="feel"></p>
                    <p id="humidity"></p>
                    <p id="wind"></p>
                    <p id="rain"></p>
                </div>`;

          
 
          const currentTemp = dataPoint.current;

          showingTemp(currentTemp);
        }

    catch (error ){
        console.error("Error fetching data:", error);
    }
}