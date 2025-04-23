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

export function updateLocationUI(resolvedAddress) {
    locationDiv.textContent = resolvedAddress;
}

export function updateWeatherDescriptionUI(description) {
    weatherDescription.textContent = description;
}

export function updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures }, isCelsius) {
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

export async function updateUI({ resolvedAddress, currentTemperature, currentTemperatureDescription, minTemperatures, maxTemperatures, weatherIcons }, isCelsius) {
    updateLocationUI(resolvedAddress);
    updateWeatherDescriptionUI(currentTemperatureDescription);
    updateTemperaturesUI({ currentTemperature, minTemperatures, maxTemperatures }, isCelsius);
    await updateWeatherIconsUI(weatherIcons);
} 