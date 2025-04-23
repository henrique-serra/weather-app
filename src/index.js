import './styles/styles.css';

const currentDateDiv = document.getElementById('current-date');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const locationDiv = document.getElementById('location');
const weatherIconsImg = document.querySelectorAll('.forecast-icon');
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

class WeatherAPIError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.name = 'WeatherAPIError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

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
  try {
      const apiKey = process.env.VISUALCROSSING_API_KEY;
      if (!apiKey) {
          throw new WeatherAPIError('Chave da API não encontrada', 401, 'A variável de ambiente VISUALCROSSING_API_KEY não está definida');
      }

      const cityEncoded = encodeURIComponent(city);
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityEncoded}?unitGroup=us&key=${apiKey}&contentType=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
          let errorMessage = 'Erro ao buscar dados do clima';
          let errorDetails = '';

          switch (response.status) {
              case 400:
                  errorMessage = 'Parâmetros inválidos na requisição';
                  break;
              case 401:
                  errorMessage = 'Chave da API inválida ou sem autorização';
                  break;
              case 404:
                  errorMessage = 'Cidade não encontrada';
                  break;
              case 429:
                  errorMessage = 'Limite de requisições excedido';
                  break;
              case 500:
                  errorMessage = 'Erro interno do servidor';
                  break;
              default:
                  errorMessage = `Erro desconhecido: ${response.status}`;
          }

          try {
              const errorData = await response.json();
              errorDetails = errorData.message || JSON.stringify(errorData);
          } catch (e) {
              errorDetails = 'Não foi possível obter detalhes do erro';
          }

          throw new WeatherAPIError(errorMessage, response.status, errorDetails);
      }

      const data = await response.json();
      const { resolvedAddress, days } = data;
      const [today, ...futureDays] = days;
      const { temp: currentTemperature, description: currentTemperatureDescription } = today;
      const minTemperatures = days.map(day => day.tempmin);
      const maxTemperatures = days.map(day => day.tempmax);
      const weatherIcons = days.map(day => day.icon);
      
      return { resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures, weatherIcons, ...data };
  } catch (error) {
      if (error instanceof WeatherAPIError) {
          throw error;
      }
      throw new WeatherAPIError(
          'Erro ao processar requisição',
          500,
          error.message
      );
  }
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
    // Adiciona classe de transição
    temperatureSpans.currentTemperatureToday.classList.add('temperature-transition');
    temperatureSpans.minTemperature.forEach(span => span.classList.add('temperature-transition'));
    temperatureSpans.maxTemperature.forEach(span => span.classList.add('temperature-transition'));
    temperatureSpans.temperatureUnits.forEach(span => span.classList.add('temperature-transition'));

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

    // Remove a classe de transição após a animação
    setTimeout(() => {
        temperatureSpans.currentTemperatureToday.classList.remove('temperature-transition');
        temperatureSpans.minTemperature.forEach(span => span.classList.remove('temperature-transition'));
        temperatureSpans.maxTemperature.forEach(span => span.classList.remove('temperature-transition'));
        temperatureSpans.temperatureUnits.forEach(span => span.classList.remove('temperature-transition'));
    }, 300);
}

async function updateWeatherIconsUI(weatherData) {
  const weatherIcons = weatherData.weatherIcons;
  for (let i = 0; i < 7; i++) {
    const weatherIconImport = await import(`./icons/${weatherIcons[i]}.svg`);
    weatherIconsImg[i].src = weatherIconImport.default;
  }
}

function updateNext6DaysUI(next6Days) {
  next6Days.forEach((d, i) => {
    const { dayOfWeek, day, monthName, year } = d;
    dayNames[i].textContent = dayOfWeek;
  });
}

async function updateUI({ resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures }) {
    updateLocationUI(resolvedAddress);
    updateWeatherDescriptionUI(currentTemperatureDescription);
    updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures });
    await updateWeatherIconsUI(weatherData);
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
    console.log(weatherData);
    if (!isCelsius) {
        convertWeatherDataTemperatures();
        updateTemperaturesUI(weatherData);
    }
    await updateUI(weatherData);
});

document.addEventListener('DOMContentLoaded', () => {
  const { dayOfWeek, day, monthName, year } = getDate();
  const next6Days = getNext6Days();
  updateNext6DaysUI(next6Days);
  currentDateDiv.textContent = `${dayOfWeek}, ${day} de ${monthName} de ${year}`;
});