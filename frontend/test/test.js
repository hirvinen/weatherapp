const rewire = require('rewire');
const backend = rewire('../../backend/src/index.js');
const assert = require('assert');
const fetch = require('node-fetch');
require('babel-register')({
  presets: [
    'babel-preset-react',
    'babel-preset-es2016',
    [
      'babel-preset-env',
      {
        'exclude':  ['babel-plugin-transform-regenerator'],
      },
    ],
  ],
  plugins: [
    'babel-plugin-rewire',
    'fast-async',
  ],
});

const frontend = require('../src/index.jsx');

      frontend.__set__({ fetch });
      console.log(frontend.__get__('fetch'));
const getWeatherFromApi = frontend.__get__('getWeatherFromApi');

describe('frontend', () => {
  describe('getWeatherFromApi', () => {
    before(() => {
    });

    describe('When called with an object containing property "type"', () => {
      it('should return an object with a property "icon" of type string, when type is "current"', () => {
        const result = getWeatherFromApi({ type: 'current', });
        assert.strictEqual(typeof result.icon, 'string');
      });
      it('should return an object with a property "icon" of type string, when type is "forecast"', () => {
        const result = getWeatherFromApi({ type: 'forecast', });
        assert.strictEqual(typeof result.icon, 'string');
      });
    });

    after(() => {
      //frontend.__ResetDependency__('fetch');
    })
  });
});
