import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

// Default to forecast. Current weather is the only currently supported alternative.
const getWeatherFromApi = async (type = "forecast") => {
  try {
    if (type !== "forecast" && type !== "current") throw Error(`Unsupported weather type '${type}'`);
    const apiPath = type === "current"
      ? "weather"
      : type;
    const response = await fetch(`${baseURL}/${apiPath}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: "",
    };
  }

  async componentWillMount() {
    const weatherType = window.location.search.replace(/^\?/, '') || "forecast";
    const weather     = await getWeatherFromApi(weatherType);

    this.setState({icon: weather.icon.slice(0, -1)});
  }

  render() {
    const { icon } = this.state;

    return (
      <div className="icon">
        { icon && <img src={`/img/${icon}.svg`} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
