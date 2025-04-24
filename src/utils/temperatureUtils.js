import { temperatureToggle } from '../ui/weatherUI';

export function farenheitToCelsius(farenheit) {
    return Number(((farenheit - 32) * 5 / 9).toFixed(1));
}

export function celsiusToFarenheit(celsius) {
    return Number(((celsius * 9 / 5) + 32).toFixed(1));
}

export function convertWeatherDataTemperatures(weatherData) {
    const convertFunction = temperatureToggle.checked ? celsiusToFarenheit : farenheitToCelsius;
    
    weatherData.currentTemperature = convertFunction(weatherData.currentTemperature);
    weatherData.minTemperatures = weatherData.minTemperatures.map(convertFunction);
    weatherData.maxTemperatures = weatherData.maxTemperatures.map(convertFunction);

    return weatherData;
} 