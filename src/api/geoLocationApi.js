export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Erro ao obter localização:", error.message);
          reject(`Erro ao obter localização: ${error.message}`);
        }
      );
    } else {
      console.log("Geolocalização não é suportada neste navegador.");
      reject("Geolocalização não é suportada neste navegador.");
    }
  });
}