import './styles/styles.css';

const currentDateDiv = document.getElementById('current-date');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const locationDiv = document.getElementById('location');
const weatherIcon = document.querySelector('.weather-icon');
const temperatureContainer = document.querySelector('.temperature-container');
const temperatureRange = document.querySelector('.temperature-range');
const minTemp = document.querySelector('.min-temp');
const maxTemp = document.querySelector('.max-temp');
const weatherDescription = document.querySelector('.weather-description');

function getCurrentDate() {
    const currentDate = new Date();
    const dayOfWeek = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const day = currentDate.getDate();
    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();
    return `${capitalizedDayOfWeek}, ${day} de ${monthName} de ${year}`;
}

async function getWeatherData(city) {
    const apiKey = process.env.VISUALCROSSING_API_KEY;
    const cityEncoded = encodeURIComponent(city);
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityEncoded}?unitGroup=us&key=${apiKey}&contentType=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function updateUI(weatherData) {
    locationDiv.textContent = weatherData.resolvedAddress;
    weatherIcon.src = weatherData.currentConditions.icon;
    temperatureContainer.textContent = weatherData.currentConditions.temp;
    temperatureRange.textContent = `${weatherData.currentConditions.tempmin}°C - ${weatherData.currentConditions.tempmax}°C`;
    weatherDescription.textContent = weatherData.currentConditions.description;
}

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

searchButton.addEventListener('click', async () => {
    const city = searchInput.value;
    const weatherData = await getWeatherData(city);
    console.log(weatherData);
    updateUI(weatherData);
});

document.addEventListener('DOMContentLoaded', () => {
    currentDateDiv.textContent = getCurrentDate();
});


// fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Brasilia?unitGroup=us&key=RT55BEMXQ6UPTW6D2AKBF8AT5&contentType=json')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => {
//         console.error('Error fetching weather data:', error);
//     });