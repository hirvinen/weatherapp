import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

// Default to forecast. Current weather is the only currently supported alternative.
const getWeatherFromApi = async (type = 'forecast') => {
  try {
    if (type !== 'forecast' && type !== 'current') throw Error(`Unsupported weather type '${type}'`);
    const apiPath = type === 'current'
      ? 'weather'
      : type;
    const response = await fetch(`${baseURL}/${apiPath}`);
    return response.json();
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
    };
  }

  async componentWillMount() {
    // eslint-disable-next-line no-undef
    const weatherTypeFromSearch = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '';
    const weatherType = weatherTypeFromSearch || 'forecast';

    const weather = await getWeatherFromApi(weatherType);

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
