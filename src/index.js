function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getWeatherIconByDescription(description) {
  if (description.toLowerCase().includes('scattered clouds')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/scattered-clouds-day.png';
  } else if (description.toLowerCase().includes('rain')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/rain-night.png';
  } else if (description.toLowerCase().includes('light rain')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/rain-day.png';
  } else if (description.toLowerCase().includes('broken cloud')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/broken-clouds-day.png';
  } else if (description.toLowerCase().includes('clear sky')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-day.png';
  } else {
    return 'https://shecodes-assets.s3.amazonaws.com/api/weather/icons/mist-day.png';
  }
}

function displayWeather(response) {
  let temperatureElement = document.querySelector("#temperature-value");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity-value");
  let windSpeedElement = document.querySelector("#wind-speed-value");
  let dateElement = document.querySelector("#current-date");
  let iconElement = document.querySelector("#icon");

  let temperature = response.data.temperature.current;
  let description = response.data.condition.description;
  let humidity = response.data.temperature.humidity;
  let windSpeed = response.data.wind.speed;
  let city = response.data.city;
  let date = new Date(response.data.time * 1000);

  cityElement.innerHTML = `${city}`;
  dateElement.innerHTML = formatFullDate(date);
  descriptionElement.innerHTML = toTitleCase(description);
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
  windSpeedElement.innerHTML = `Wind: ${Math.round(windSpeed * 3.6)} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${getWeatherIconByDescription(description)}" class="current-weather-icon"/>`;
}

function formatFullDate(date) {
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let dateNumber = date.getDate();
  return `${day}, ${month} ${dateNumber}, ${year}`;
}

function formatDay(date) {
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

function formatHours(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}


function displayForecast(response) {
  let forecastElement = document.querySelector("#daily-forecast");
  let forecastHTML = ``;

  response.data.daily.forEach(function(forecastDay, index) {
    if (index < 5) {
      let forecastDate = new Date(forecastDay.time * 1000);
      let day = formatDay(forecastDate);

      forecastHTML +=
        `<div class="weather-forecast-item">
          <div class="weather-forecast-dates">${day}</div>
         
          <div class="weather-forecast-icon">
            <img src="${getWeatherIconByDescription(forecastDay.condition.description)}" alt=""/>
          </div>
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max">Max-temp: ${Math.round(forecastDay.temperature.maximum)}°</span>
            <span class="weather-forecast-temperature-min">Min-temp: ${Math.round(forecastDay.temperature.minimum)}°</span>
          </div>
        </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function search(city) {
  let apiKey = "e165ab4o82t6774be34bfe406eaaafd2";
  let apiUrlCurrent = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrlCurrent).then(displayWeather);

  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#search-input");
  search(cityInputElement.value);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

search("Lagos");
