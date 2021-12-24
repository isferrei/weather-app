<template>
  <div class="container">
    <label for="city">Type your city name:</label>
    <input
      type="text"
      id="city"
      name="city"
      v-model="city"
      @keypress="onGetWeather"
    />
    <h5 v-if="loading">LOADING...</h5>
    <div class="info-card" v-if="weather">
      <h5>{{ weather.name }}, {{ weather.sys.country }}</h5>
      <h2>{{ weather.weather[0].main }}</h2>
      <h3>{{ Math.round(weather.main.temp) }}°C</h3>
      <div class="max-min-temp">
        <h5>
          Today's high temperature:
          {{ Math.round(weather.main.temp_max) }}°C
          <br />
          Today's low temperature:
          {{ Math.round(weather.main.temp_min) }}°C
        </h5>
        <button @click="details = !details">More details</button>
      </div>
      <div v-if="details">
        <h3>Details</h3>
        <h5>
          Wind Speed: {{ weather.wind.speed }}m/h
          <br />
          Humidity: {{ weather.main.humidity }}
          <br />
          Pressure: {{ weather.main.pressure }}
          <br />
          Sunrise/Sunset Time:
          {{ new Date(weather.sys.sunrise * 1000).toLocaleTimeString() }} /
          {{ new Date(weather.sys.sunset * 1000).toLocaleTimeString() }}
        </h5>
      </div>
    </div>
    <h5 v-if="loading_next_days">LOADING...</h5>
    <h3 v-if="next_weather">Next 7 days:</h3>
    <div class="next-weather-section">
      <div
        :key="weather.id"
        v-for="weather in next_weather"
        class="weather-days-card"
      >
        <h5>
          {{ weather.weather[0].main }} {{ Math.round(weather.temp.day) }}°C
        </h5>
      </div>
    </div>
    <h3 v-if="prev_weather">Last 5 days:</h3>
    <div class="next-weather-section">
      <div
        :key="weather.id"
        v-for="weather in prev_weather"
        class="weather-days-card"
      >
        <h5>{{ weather.weather[0].main }} {{ Math.round(weather.temp) }}°C</h5>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getWeather,
  getNextDaysWeather,
  getPrevDaysWeather,
  getCurrentLocation,
} from "@/services.js";

export default {
  name: "Weather",
  el: "#app",
  data() {
    return {
      city: "",
      details: false,
      weather: null,
      next_weather: null,
      date: "",
      loading: false,
      loading_next_days: false,
      days_ago: null,
      prev_weather: null,
    };
  },
  created() {
    navigator.geolocation.getCurrentPosition((position) => {
      getCurrentLocation(
        position.coords.latitude,
        position.coords.longitude
      ).then((res) => {
        this.city = res.data.results[0].address_components[3].long_name;
      });
    });
  },
  methods: {
    async onGetWeather(e) {
      const city = this.city;
      if (e.key == "Enter") {
        this.loading = true;
        await getWeather(city).then((res) => {
          this.weather = res.data;
        });
        if (this.weather) {
          this.loading = false;
        }
        this.loading_next_days = true;
        const lat = this.weather.coord.lat;
        const lon = this.weather.coord.lon;
        await getNextDaysWeather(lat, lon).then((res) => {
          this.next_weather = res.data.daily;
          if (this.next_weather) {
            this.loading_next_days = false;
          }
        });

        this.prev_weather = [];

        for (var i = 1; i <= 5; i++) {
          this.days_ago = Math.round(
            new Date(new Date().setDate(new Date().getDate() - i)) / 1000
          );

          console.log(this.days_ago);
          await getPrevDaysWeather(lat, lon, this.days_ago).then((res) => {
            this.prev_weather.push(res.data.current);
          });
        }
        console.log("5 days weather", this.prev_weather);
        console.log("7 days weather", this.next_weather);
      }
    },
  },
};
</script>
  <style scoped>
a {
  color: #42b983;
}
.container {
  display: flex;
  flex-direction: column;
  padding: 60px 0;
  background-image: url(../assets/bg.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100vh;
}
label {
  font-weight: bold;
}
input {
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  height: 40px;
  width: 90%;
  margin: 15px auto 0 auto;
  padding-left: 15px;
}
button {
  text-decoration: underline;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #d8d8d8;
}
.info-card {
  margin: 3% auto 0 auto;
  background-color: #97cae42d;
  border: 1px solid #d8d8d8;
  border-radius: 30px;
  width: 40%;
  height: auto;
  padding: 15px;
}
@media only screen and (max-width: 600px) {
  .info-card {
    width: 80%;
  }
  input {
    height: 40px;
  }
}
.max-min-temp {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 80%;
}
.next-weather-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, 95px);
  row-gap: 20px;
  margin: 0 auto;
  justify-content: space-evenly;
  width: 80%;
}
.weather-days-card {
  background-color: #9191912d;
  border: 1px solid #d8d8d8;
  border-radius: 30px;
  padding: 5px;
  width: 50px;
  height: 50px;
  align-items: center;
  display: flex;
  place-content: center;
  gap: 10px;
}
</style>