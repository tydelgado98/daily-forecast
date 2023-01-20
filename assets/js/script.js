let history = document.getElementById('history');
let current = document.getElementById('current');
let forecast = document.getElementById('forecast');

render_History();

async function render_History() {
  if(localStorage.history) {
    let store = await JSON.parse(localStorage.history);
    history.innerHTML ='';
    
    store.forEach(city => {
      history.innerHTML += `<button onclick="handleHistory('${city}')">${city}</button>`;
    });
  }
};



document.querySelector('#search').addEventListener('click', searchCity);

function handleHistory(city) {
  document.querySelector('input').value = city;
  searchCity();
  console.log(city);
}

async function searchCity() {
  let city = document.querySelector('input').value;

  if (!city) return;

  let store = localStorage.history ? await JSON.parse(localStorage.history) : [];
  if(!store.includes(city)) store.push(city);

  localStorage.history = JSON.stringify(store);

  render_History();

  let { list } = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=3be2b2b6acc21e3760901d15acf91f72&units=imperial&q=${city}`)).json()

  let { dt, wind: { speed }, main: { temp, humidity }, weather: [{ icon }] } = list[0];

  current.innerHTML = `
  <div>
    <h2>${city} (${new Date(dt * 1000).toDateString()}) </h2>
    <h4>Temp: ${temp}°F</h4>
    <h4>Wind: ${speed} MPH</h4>
    <h4>Humidity: ${humidity}%</h4> 
    </div>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
  `;

  forecast.innerHTML = "";

  for (let i = 7; i < list.length; i = i + 8) {
    let { dt, wind: { speed }, main: { temp, humidity }, weather: [{ icon }] } = list[i];

    forecast.innerHTML += `
    <div class="card">
      <h4>${new Date(dt * 1000).toDateString().slice(0, -5)}<h4>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
      <h6>Temp: ${temp}°F</h6>
      <h6>Wind: ${speed} MPH</h6>
      <h6>Humidity: ${humidity}%</h6>
    </div>
    `;
  }
};