export class WeatherAPIError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.name = 'WeatherAPIError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

export async function getWeatherData(city) {
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
        
        return { 
            resolvedAddress, 
            currentTemperature,
            currentTemperatureDescription,
            minTemperatures,
            maxTemperatures,
            weatherIcons,
            ...data,
        };
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