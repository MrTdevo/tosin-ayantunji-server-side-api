$(document).ready(function () {
  const apiKey = "665c82f66eb19c9171ae27e9a1c1ed9d"; // Replace with your actual API key

  // Function to fetch and display weather
  function fetchWeather(city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    $.get(queryURL, function (data) {
      const {
        name,
        main: { temp, humidity },
        wind: { speed },
        weather,
      } = data;
      const iconURL = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
      const date = new Date().toLocaleDateString();

      $("#current-weather").html(`
                <div class="weather-item">
                    <h2>${name} (${date})</h2>
                    <img class="weather-icon" src="${iconURL}" alt="${weather[0].description}">
                    <p>Temperature: ${temp} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${speed} m/s</p>
                </div>
            `);
    });

    $.get(forecastURL, function (data) {
      const forecastItems = data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5);

      let forecastHTML = "<h2>5-Day Forecast</h2>";
      forecastItems.forEach((item) => {
        const {
          dt_txt,
          main: { temp, humidity },
          wind: { speed },
          weather,
        } = item;
        const iconURL = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
        forecastHTML += `
                    <div class="weather-item">
                        <h3>${new Date(dt_txt).toLocaleDateString()}</h3>
                        <img class="weather-icon" src="${iconURL}" alt="${
          weather[0].description
        }">
                        <p>Temperature: ${temp} °C</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind Speed: ${speed} m/s</p>
                    </div>
                `;
      });
      $("#forecast").html(forecastHTML);
    });
  }

  // Function to save and display search history
  function addSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    displaySearchHistory();
  }

  // Function to display search history
  function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    $("#search-history").empty();
    searchHistory.forEach((city) => {
      $("#search-history").append(`<div class="history-item">${city}</div>`);
    });
  }

  // Event listener for search form
  $("#city-search-form").on("submit", function (event) {
    event.preventDefault();
    const city = $("#city-input").val().trim();
    if (city) {
      fetchWeather(city);
      addSearchHistory(city);
      $("#city-input").val("");
    }
  });

  // Event listener for search history items
  $("#search-history").on("click", ".history-item", function () {
    const city = $(this).text();
    fetchWeather(city);
  });

  // Initial display of search history
  displaySearchHistory();
});
