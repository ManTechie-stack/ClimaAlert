const apiKey = '01cdba5f4b89efc2a0b20a7311fdc929';

async function getWeather(cityName = null) {
  const display = document.getElementById('weatherDisplay');
  const forecastDisplay = document.getElementById('forecastDisplay');
  const cityInput = document.getElementById('cityInput');
  let city = cityName || cityInput.value.trim();

  if (!city) {
    display.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  display.innerHTML = '<p>Loading weather...</p>';
  forecastDisplay.innerHTML = '';

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},NG&appid=${apiKey}&units=metric`);
    const data = await res.json();

    const { name } = data;
    const { temp, humidity } = data.main;
    const { description } = data.weather[0];
    const { speed } = data.wind;

    display.innerHTML = `
      <h2>${name}</h2>
      <p><strong>🌡️ Temperature:</strong> ${temp}°C</p>
      <p><strong>🌤️ Condition:</strong> ${description}</p>
      <p><strong>💧 Humidity:</strong> ${humidity}%</p>
      <p><strong>💨 Wind Speed:</strong> ${speed} m/s</p>
    `;

    getForecast(city);

  } catch (err) {
    display.innerHTML = `<p style="color: #ffcccc;"><strong>Error:</strong> ${err.message}</p>`;
  }
}

async function getForecast(city) {
  const forecastDisplay = document.getElementById('forecastDisplay');
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},NG&appid=${apiKey}&units=metric`);
    const data = await res.json();
    const forecastCards = [];

    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt_txt).toLocaleDateString();
      const temp = forecast.main.temp;
      const desc = forecast.weather[0].description;
      forecastCards.push(`
        <div class="forecast-card">
          <p><strong>${date}</strong></p>
          <p>🌡️ ${temp}°C</p>
          <p>🌤️ ${desc}</p>
        </div>
      `);
    }

    forecastDisplay.innerHTML = forecastCards.join('');
  } catch (err) {
    forecastDisplay.innerHTML = `<p style="color: red;">Forecast error: ${err.message}</p>`;
  }
}

// Auto-detect on load
window.onload = function () {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const geoRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
        const geoData = await geoRes.json();
        getWeather(geoData.name);
      } catch {
        getWeather("Lagos");
      }
    }, () => getWeather("Lagos"));
  } else {
    getWeather("Lagos");
  }
};