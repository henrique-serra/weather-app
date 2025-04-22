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
const dayNames = document.querySelectorAll('.day-name');
let isCelsius = false;
let weatherData;

function getDate(date = new Date()) {
  const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const day = date.getDate();
  const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
  const year = date.getFullYear();
  return { 
    dayOfWeek: capitalizedDayOfWeek, day, monthName, year 
  }
}

function getNext6Days() {
  const UM_DIA_EM_MS = 24 * 60 * 60 * 1000; // 86400000 milissegundos  
  const currentDate = new Date();
  const next6Days = [];
  for (let i = 1; i < 7; i++) {
      const nextDay = new Date(currentDate.getTime() + UM_DIA_EM_MS * i);
      next6Days.push(getDate(nextDay));
  }
  return next6Days;
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
        unit.textContent = isCelsius ? '°C' : '°F';
    });
}

function updateNext6DaysUI(next6Days) {
  next6Days.forEach((d, i) => {
    const { dayOfWeek, day, monthName, year } = d;
    dayNames[i].textContent = dayOfWeek;
  });
}

function updateUI({ resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures }) {
    updateLocationUI(resolvedAddress);
    updateWeatherDescriptionUI(currentTemperatureDescription);
    updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures });
}

temperatureToggle.addEventListener('change', () => {
  convertWeatherDataTemperatures();
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
    if (!isCelsius) temperatureToggle.click();
    updateUI(weatherData);
});

document.addEventListener('DOMContentLoaded', () => {
  const { dayOfWeek, day, monthName, year } = getDate();
  const next6Days = getNext6Days();
  updateNext6DaysUI(next6Days);
  currentDateDiv.textContent = `${dayOfWeek}, ${day} de ${monthName} de ${year}`;
});