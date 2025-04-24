import { getWeatherData } from '../api/weatherApi';
import { convertWeatherDataTemperatures } from '../utils/temperatureUtils';
import { 
    updateUI,
    updateTemperaturesUI, 
    temperatureToggle, 
    searchInput, 
    searchButton,
    showLoading,
    hideLoading
} from '../ui/weatherUI';

export function setupWeatherEvents(weatherData) {

    temperatureToggle.addEventListener('change', () => {
        weatherData = convertWeatherDataTemperatures(weatherData);
        updateTemperaturesUI(weatherData);
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    searchButton.addEventListener('click', async () => {
        try {
            showLoading();
            const city = searchInput.value;
            weatherData = await getWeatherData(city);
            temperatureToggle.checked = false;
            convertWeatherDataTemperatures(weatherData);
            await updateUI(weatherData);
        } catch (error) {
            console.error("Erro ao buscar dados da cidade:", error);
        } finally {
            hideLoading();
        }
    });

} 