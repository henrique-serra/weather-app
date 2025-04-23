import './styles/styles.css';
import { getDate, getNext6Days } from './utils/dateUtils';
import { currentDateDiv, updateNext6DaysUI } from './ui/weatherUI';
import { setupWeatherEvents } from './events/weatherEvents';

// Estado global da aplicação
let weatherData = null;
let isCelsius = false;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Configura a data atual e próximos dias
    const { dayOfWeek, day, monthName, year } = getDate();
    const next6Days = getNext6Days();
    
    // Atualiza a UI com as datas
    updateNext6DaysUI(next6Days);
    currentDateDiv.textContent = `${dayOfWeek}, ${day} de ${monthName} de ${year}`;
    
    // Configura os eventos e atualiza o estado global
    const { weatherData: updatedWeatherData, isCelsius: updatedIsCelsius } = setupWeatherEvents(weatherData, isCelsius);
    weatherData = updatedWeatherData;
    isCelsius = updatedIsCelsius;
}); 