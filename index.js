
const form = document.getElementById("form");
const readInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");

form.addEventListener("submit", fetchWeather)

async function fetchWeather(event) {

    event.preventDefault()
    const lat = readInput.dataset.lat;
    const lon = readInput.dataset.lon;

      if (!lat || !lon) {
      console.log("Please select a city from the suggestions");
      return;
    }

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=Africa/Lagos`);

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const dataPoint = await response.json();
        console.log("Weather data:", dataPoint);
    }

    catch (error ){
        console.error("Error fetching data:", error);
    }
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
