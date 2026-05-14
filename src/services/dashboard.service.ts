
export class DashboardService {
   static async getLocationAndWeather(lat: number, lon: number) {
    const [locRes, weatherRes] = await Promise.all([
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      ).then((res) => res.json()),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      ).then((res) => res.json()),
    ]);

    return {
      location: locRes.city || locRes.locality || "Unknown",
      temperature: weatherRes?.current_weather?.temperature ?? null,
    };
  }
}