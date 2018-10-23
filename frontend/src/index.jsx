import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

// Default to forecast. Current weather is the only currently supported alternative.
const getWeatherFromApi = async ({
  type = 'forecast',
  latitude = 0,
  longitude = 0,
}) => {
  try {
    if (type !== 'forecast' && type !== 'current') throw Error(`Unsupported weather type '${type}'`);
    const apiPath = type === 'current'
      ? 'weather'
      : type;
    const fullPath = `${baseURL}/${apiPath}?lat=${latitude}&lon=${longitude}`;
    const response = await fetch(fullPath);
    return response.json();
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  return {};
};

const getLocation = () => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-undef
  if (typeof window === 'undefined' || !('geolocation' in window.navigator)) resolve({});

  // eslint-disable-next-line no-undef
  window.navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 1000 });
}).then(position => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
})).catch((err) => {
  // eslint-disable-next-line no-console
  console.warn(`Positioning failed with error ${err.code}: ${err.message}`);
  return {};
});

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
    };
  }

  async componentWillMount() {
    // currently supported types defined in url search are forecast and current
    // eslint-disable-next-line no-undef
    const weatherTypeFromSearch = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '';
    const weatherType = weatherTypeFromSearch || 'forecast';
    const { latitude, longitude } = await getLocation();
    const weatherOptions = {
      latitude,
      longitude,
      type: weatherType,
    };

    const weather = await getWeatherFromApi(weatherOptions);

    this.setState({ icon: weather.icon.slice(0, -1) });
  }

  render() {
    const { icon } = this.state;

    return (
      <div className="icon">
        { icon && <img src={`/img/${icon}.svg`} alt="An icon depicting the type of weather" /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
