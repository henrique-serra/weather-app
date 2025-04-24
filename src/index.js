import './styles/styles.css';
import { getDate, getNext6Days } from './utils/dateUtils';
import { currentDateDiv, updateNext6DaysUI } from './ui/weatherUI';
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
    console.log('DOMContentLoaded iniciado'); // <-- Log 1
    try {
        const { latitude, longitude } = await getCurrentLocation();
        console.log('Localização obtida:', latitude, longitude); // <-- Log 2

        const currentLocation = await getLocationFromCoordinates(latitude, longitude);
        console.log('Cidade obtida:', currentLocation); // <-- Log 3

        const { dayOfWeek, day, monthName, year } = getDate();
        const next6Days = getNext6Days();
        console.log('Datas processadas'); // <-- Log 4

        updateNext6DaysUI(next6Days);
        currentDateDiv.textContent = `${dayOfWeek}, ${day} de ${monthName} de ${year}`;
        console.log('UI de datas atualizada'); // <-- Log 5

        weatherData = await getWeatherData(currentLocation);
        // Configurando os eventos
        setupWeatherEvents(weatherData);
        console.log('setupWeatherEvents retornou:', weatherData); // <-- Log 7

        // Atualizando a UI com os dados da localização atual
        temperatureToggle.checked = false;
        convertWeatherDataTemperatures(weatherData);
        await updateUI(weatherData);
        
    } catch (error) {
        console.error("Erro durante a inicialização:", error); // <-- Captura de Erro
    }
}); 