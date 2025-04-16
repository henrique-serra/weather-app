import './styles/styles.css';

const currentDateDiv = document.getElementById('current-date');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const locationDiv = document.getElementById('location');
const weatherIcon = document.querySelector('.weather-icon');
const weatherDescription = document.querySelector('.weather-description');
const temperatureSpans = {
  currentTemperatureToday: document.getElementById('current-temperature-today'),
  minTemperature: [...document.querySelectorAll('.min-temp')],
  maxTemperature: [...document.querySelectorAll('.max-temp')],
  temperatureUnits: [...document.querySelectorAll('.temperature-unit')]
};
const temperatureToggle = document.getElementById('temperature-toggle');
let isCelsius = false;
let weatherData;

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
    const { resolvedAddress, days } = data;
    const [today, ...futureDays] = days;
    const { temp: currentTemperature, description: currentTemperatureDescription } = today;
    const minTemperatures = days.map(day => day.tempmin);
    const maxTemperatures = days.map(day => day.tempmax);
    
    return { resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures, ...data };
}

function farenheitToCelsius(farenheit) {
  return Number(((farenheit - 32) * 5 / 9).toFixed(1));
}

function celsiusToFarenheit(celsius) {
  return Number(((celsius * 9 / 5) + 32).toFixed(1));
}

function convertWeatherDataTemperatures() {
  const convertFunction = isCelsius ? celsiusToFarenheit : farenheitToCelsius;
  
  weatherData.currentTemperature = convertFunction(weatherData.currentTemperature);
  weatherData.minTemperatures = weatherData.minTemperatures.map(convertFunction);
  weatherData.maxTemperatures = weatherData.maxTemperatures.map(convertFunction);

  isCelsius = !isCelsius;

  return weatherData;
}

function updateLocationUI(resolvedAddress) {
    locationDiv.textContent = resolvedAddress;
}

function updateWeatherDescriptionUI(description) {
    weatherDescription.textContent = description;
}

function updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures, temperatureUnits }) {
    // Atualiza temperatura atual
    temperatureSpans.currentTemperatureToday.textContent = Math.round(currentTemperature);
    temperatureSpans.minTemperature[0].textContent = Math.round(minTemperatures[0]);
    temperatureSpans.maxTemperature[0].textContent = Math.round(maxTemperatures[0]);
    
    // Atualiza previsão dos próximos dias
    for (let i = 1; i < 7; i++) {
        temperatureSpans.minTemperature[i].textContent = Math.round(minTemperatures[i]);
        temperatureSpans.maxTemperature[i].textContent = Math.round(maxTemperatures[i]);
    }

    // Atualiza as unidades de temperatura
    temperatureSpans.temperatureUnits.forEach(unit => {
        unit.textContent = isCelsius ? 'C' : 'F';
    });
}

function updateUI({ resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures }) {
    updateLocationUI(resolvedAddress);
    updateWeatherDescriptionUI(currentTemperatureDescription);
    updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures });
}

temperatureToggle.addEventListener('change', () => {
  convertWeatherDataTemperatures(weatherData);
  updateTemperaturesUI(weatherData);
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

searchButton.addEventListener('click', async () => {
    const city = searchInput.value;
    weatherData = await getWeatherData(city);
    convertWeatherDataTemperatures();
    updateUI(weatherData);
});

document.addEventListener('DOMContentLoaded', () => {
  currentDateDiv.textContent = getCurrentDate();
});