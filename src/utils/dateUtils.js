export function getDate(date = new Date()) {
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const day = date.getDate();
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    const year = date.getFullYear();
    return { 
        dayOfWeek: capitalizedDayOfWeek, day, monthName, year 
    }
}

export function getNext6Days() {
    const UM_DIA_EM_MS = 24 * 60 * 60 * 1000; // 86400000 milissegundos  
    const currentDate = new Date();
    const next6Days = [];
    for (let i = 1; i < 7; i++) {
        const nextDay = new Date(currentDate.getTime() + UM_DIA_EM_MS * i);
        next6Days.push(getDate(nextDay));
    }
    return next6Days;
} 