import { getWeatherData } from '../api/weatherApi';
import { convertWeatherDataTemperatures } from '../utils/temperatureUtils';
import { updateUI } from '../ui/weatherUI';

export function setupWeatherEvents(weatherData, isCelsius) {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const temperatureToggle = document.getElementById('temperature-toggle');

    temperatureToggle.addEventListener('change', () => {
        weatherData = convertWeatherDataTemperatures(weatherData, isCelsius);
        updateUI(weatherData, !isCelsius);
        isCelsius = !isCelsius;
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    searchButton.addEventListener('click', async () => {
        const city = searchInput.value;
        weatherData = await getWeatherData(city);
        if (!isCelsius) {
            weatherData = convertWeatherDataTemperatures(weatherData, isCelsius);
        }
        await updateUI(weatherData, isCelsius);
    });

    return { weatherData, isCelsius };
} 