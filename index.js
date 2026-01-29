
// async function fetchWeather() {
//     try {
//         const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation");

//         if(!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const dataPoint = await response.json();
//         console.log(dataPoint);
//     }

//     catch {
//         console.error("Error fetching data:", error);
//     }
// }

const readInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");

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
          readInput.value = `${city}, ${country}`;
          suggestionsBox.innerHTML = "";
        });

        suggestionsBox.appendChild(li);
      });
    })
    .catch(err => console.error(err));
}
