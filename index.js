
async function fetchWeather() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation");

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const dataPoint = await response.json();
        console.log(dataPoint);
    }

    catch {
        console.error("Error fetching data:", error);
    }
}