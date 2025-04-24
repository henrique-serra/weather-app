export const temperatureSpans = {
    currentTemperatureToday: document.getElementById('current-temperature-today'),
    minTemperature: [...document.querySelectorAll('.min-temp')],
    maxTemperature: [...document.querySelectorAll('.max-temp')],
    temperatureUnits: [...document.querySelectorAll('.temperature-unit')]
};

export const weatherIconsImg = document.querySelectorAll('.forecast-icon');
export const dayNames = document.querySelectorAll('.day-name');
export const locationDiv = document.getElementById('location');
export const weatherDescription = document.querySelector('.weather-description');
export const currentDateDiv = document.getElementById('current-date');
export const temperatureToggle = document.getElementById('temperature-toggle');
export const searchInput = document.querySelector('.search-input');
export const searchButton = document.querySelector('.search-button');
export const loadingContainer = document.getElementById('loading-container');

export function showLoading() {
    loadingContainer.classList.add('active');
}

export function hideLoading() {
    loadingContainer.classList.remove('active');
}

export function updateLocationUI(resolvedAddress) {
    locationDiv.textContent = resolvedAddress;
}

export function updateWeatherDescriptionUI(description) {
    weatherDescription.textContent = description;
}

// Função auxiliar para adicionar/remover a classe de transição
function toggleTemperatureTransition(temperatureSpans, add) {
    const action = add ? 'add' : 'remove';
    temperatureSpans.currentTemperatureToday.classList[action]('temperature-transition');
    temperatureSpans.minTemperature.forEach(span => span.classList[action]('temperature-transition'));
    temperatureSpans.maxTemperature.forEach(span => span.classList[action]('temperature-transition'));
    temperatureSpans.temperatureUnits.forEach(span => span.classList[action]('temperature-transition'));
} 

export function updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures }) {
    // Adiciona classe de transição
    toggleTemperatureTransition(temperatureSpans, true);

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
        unit.textContent = temperatureToggle.checked ? '°F' : '°C';
    });

    // Remove a classe de transição após a animação
    setTimeout(() => {
        toggleTemperatureTransition(temperatureSpans, false);
    }, 300);
}

export async function updateWeatherIconsUI(weatherIcons) {
    for (let i = 0; i < 7; i++) {
        const weatherIconImport = await import(`../icons/${weatherIcons[i]}.svg`);
        weatherIconsImg[i].src = weatherIconImport.default;
    }
}

export function updateNext6DaysUI(next6Days) {
    next6Days.forEach((d, i) => {
        const { dayOfWeek } = d;
        dayNames[i].textContent = dayOfWeek;
    });
}

export async function updateUI({ resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures, weatherIcons }) {
    updateLocationUI(resolvedAddress);
    updateWeatherDescriptionUI(currentTemperatureDescription);
    updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures });
    await updateWeatherIconsUI(weatherIcons);
}