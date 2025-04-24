export async function getLocationFromCoordinates(latitude, longitude) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results;
  const typeLocationsToFind = ['locality', 'political'];
  
  const formatted_address = results.find((result) => {
    return typeLocationsToFind.every((type) => result.types.includes(type));
  }).formatted_address;

  return formatted_address;
}