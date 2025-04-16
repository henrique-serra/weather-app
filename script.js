document.addEventListener('DOMContentLoaded', () => {
    const temperatureToggle = document.getElementById('temperature-toggle');
    let isCelsius = true;

    // Função para converter Celsius para Fahrenheit
    const celsiusToFahrenheit = (celsius) => {
        return (celsius * 9/5) + 32;
    };

    // Função para converter Fahrenheit para Celsius
    const fahrenheitToCelsius = (fahrenheit) => {
        return (fahrenheit - 32) * 5/9;
    };

    // Função para atualizar todas as temperaturas na interface
    const updateTemperatures = () => {
        const temperatureElements = document.querySelectorAll('[id^="current-temperature"], [id^="min-temperature"], [id^="max-temperature"]');
        const unitElements = document.querySelectorAll('.temperature-unit');
        
        temperatureElements.forEach(element => {
            const currentValue = parseFloat(element.textContent);
            if (!isNaN(currentValue)) {
                if (isCelsius) {
                    // Se estiver em Fahrenheit, converte para Celsius
                    element.textContent = Math.round(fahrenheitToCelsius(currentValue));
                } else {
                    // Se estiver em Celsius, converte para Fahrenheit
                    element.textContent = Math.round(celsiusToFahrenheit(currentValue));
                }
            }
        });

        // Atualiza as unidades de temperatura
        unitElements.forEach(element => {
            element.textContent = isCelsius ? 'C' : 'F';
        });
    };

    // Event listener para o toggle
    temperatureToggle.addEventListener('change', () => {
        isCelsius = !isCelsius;
        updateTemperatures();
    });
}); 