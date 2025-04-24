import './styles/styles.css';
import { getDate, getNext6Days } from './utils/dateUtils';
import { currentDateDiv, updateNext6DaysUI, showLoading, hideLoading } from './ui/weatherUI';
import { setupWeatherEvents } from './events/weatherEvents';
import { getCurrentLocation } from './api/geoLocationApi';
import { getLocationFromCoordinates } from './api/geoCodingApi';
import { getWeatherData } from './api/weatherApi';
import { searchInput, searchButton } from './ui/weatherUI';
import { convertWeatherDataTemperatures } from './utils/temperatureUtils';
import { updateUI } from './ui/weatherUI';
import { temperatureToggle } from './ui/weatherUI';

// Obtém a localização atual do usuário
let weatherData = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded iniciado');
    try {
        showLoading();
        const { latitude, longitude } = await getCurrentLocation();
        console.log('Localização obtida:', latitude, longitude);

        const currentLocation = await getLocationFromCoordinates(latitude, longitude);
        console.log('Cidade obtida:', currentLocation);

        const { dayOfWeek, day, monthName, year } = getDate();
        const next6Days = getNext6Days();
        console.log('Datas processadas');

        updateNext6DaysUI(next6Days);
        currentDateDiv.textContent = `${dayOfWeek}, ${day} de ${monthName} de ${year}`;
        console.log('UI de datas atualizada');

        weatherData = await getWeatherData(currentLocation);
        setupWeatherEvents(weatherData);
        console.log('setupWeatherEvents retornou:', weatherData);

        temperatureToggle.checked = false;
        convertWeatherDataTemperatures(weatherData);
        await updateUI(weatherData);
        hideLoading();
        
    } catch (error) {
        console.error("Erro durante a inicialização:", error);
        hideLoading();
    }
}); 