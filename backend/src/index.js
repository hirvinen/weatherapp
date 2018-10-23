const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async ({
  type = 'forecast',
  lat = null,
  lon = null,
  city = targetCity,
}) => {
  const apiQuery = lat === null && lon === null
    ? `q=${targetCity}&appid=${appId}`
    : `lat=${lat}&lon=${lon}&appid=${appId}`;
  const endpoint = `${mapURI}/${type}?${apiQuery}`;
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const weatherData = await fetchWeather({ ...ctx.query, type: 'weather', });

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

router.get('/api/forecast', async ctx => {
  const weatherData = await fetchWeather({ ...ctx.query, type: 'forecast', });

  // Get the first forecast that is at least two hours in the future
  const minimumTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  // Guard against data not being ordered in ascending time order
  const maximumTime = minimumTime + 3 * 60 * 60;

  const forecast = weatherData.list
    ? weatherData.list.find(weatherSlice => minimumTime <= weatherSlice.dt && weatherSlice.dt <= maximumTime)
    : false;

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = forecast
    ? forecast.weather[0]
    : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
