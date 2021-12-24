import axios from 'axios';

export function getWeather(city) {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=bfe3f939557c90ad20942db01f39b179`
  );
}

export function getNextDaysWeather(lat, lon) {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=bfe3f939557c90ad20942db01f39b179`
  );
}

export function getPrevDaysWeather(lat, lon, date) {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${date}&units=metric&appid=bfe3f939557c90ad20942db01f39b179`
  );
}

export function getCurrentLocation(lat, lon) {
  return axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyA0gs5738ZyleG3vNhDEGBBLluWpB3oxx8`
  );
}
