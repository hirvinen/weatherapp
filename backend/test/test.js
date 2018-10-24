const rewire = require('rewire');
const assert = require('assert');
const backend = rewire('../src/index.js');
const fetchWeather = backend.__get__('fetchWeather');
console.log(backend.__get__('appId'));

describe('backend', () => {
  describe('fetchWeather', () => {
    describe('When called with an object containing property "type"', () => {
      it('should return an object with an array "weather" with first item having property "icon" of type string, when type is "weather"', async () => {
        const result = await fetchWeather({ type: "weather", })
        assert.strictEqual(typeof result.weather[0].icon, 'string');
      });
      it('should return an object with an array "list" with an item with property "dt", between now + 7200s and now + 18000s, with an array "weather", with first item having property "icon" of type string, when type is "forecast"', async () => {
        const minimumTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
        const maximumTime = minimumTime + 3 * 60 * 60;

        const result = await fetchWeather({ type: "forecast" })
        const forecast = result.list.find(weatherSlice => minimumTime <= weatherSlice.dt && weatherSlice.dt <= maximumTime)
        assert.strictEqual(typeof forecast.weather[0].icon, 'string');
      });
    });
  });
});

