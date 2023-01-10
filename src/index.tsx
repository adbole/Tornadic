//React
import React from 'react';
import ReactDOM from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';

//Components
import Now from './Components/Now'
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';
import Radar from './Components/Radar';
import { Alert, AlertTypes, SimpleInfoWidget } from './Components/SimpleComponents';
import LevelWidget from './Components/LevelWidget';
import Wind from './Components/Wind';
import SunTime from './Components/SunTime';

import WeatherContext, { useWeather } from './Components/WeatherContext'
import { WeatherHelper } from './ts/WeatherHelper';

//Icons
import * as WidgetIcons from './svgs/widget/widget.svgs'

const DayValues = () => {
    const forecastData = useWeather()!.forecast;
    const airqualityData = useWeather()!.airquality;

    return (
        <>
            <SimpleInfoWidget icon={<WidgetIcons.Droplet />} title="Precipitation" value={`${forecastData.hourly.precipitation[forecastData.currentIndex]}\"`} />
            <SimpleInfoWidget icon={<WidgetIcons.Thermometer />} title="Dew Point" value={`${forecastData.hourly.dewpoint_2m[forecastData.currentIndex]}°`} />
            <SimpleInfoWidget icon={<WidgetIcons.Moisture />} title="Humidity" value={`${forecastData.hourly.relativehumidity_2m[forecastData.currentIndex]}%`} />
            <SimpleInfoWidget icon={<WidgetIcons.Eye />} title="Visibility" value={`${WeatherHelper.ToKM(forecastData.hourly.visibility[forecastData.currentIndex])} km`} />
            <LevelWidget id="AQ" min={0} max={500} title="Air Quality" value={airqualityData.hourly.us_aqi[forecastData.currentIndex]} message={WeatherHelper.GetAQMessage(airqualityData.hourly.us_aqi[forecastData.currentIndex])} />
            <LevelWidget id="UV" min={0} max={11} title="UV Index" value={airqualityData.hourly.uv_index[forecastData.currentIndex]} message={WeatherHelper.GetUVMessage(airqualityData.hourly.uv_index[forecastData.currentIndex])} />
            <Wind speed={forecastData.hourly.windspeed_10m[forecastData.currentIndex]} deg={forecastData.hourly.winddirection_10m[forecastData.currentIndex]}/>
            <SunTime/>
        </>
    )
}

const root = ReactDOM.createRoot(document.querySelector('body')!);
root.render(
    <>
        <WeatherContext>
            <Now/>
            <Alert type={AlertTypes.WARNING} name="Tornado Warning" message="Seek shelter in a center room or basement. Stay away from windows and keep head down."/>
            <div id="panel">
                <Hourly/>
                <Daily/>
                <Radar />
                <DayValues />
            </div>
        </WeatherContext>
    </>
)

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// const navbar = ReactDOM.createRoot(document.getElementById('nav'));
// navbar.render(
//   <React.StrictMode>
//     <Navbar />
//   </React.StrictMode>
// )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
