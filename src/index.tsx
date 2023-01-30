//React
import React from 'react';
import ReactDOM from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';

//Components
import Now from './Components/Now'
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';
import Radar from './Components/Radar';
import { SimpleInfoWidget } from './Components/SimpleComponents';
import HazardLevelView from './Components/HazardLevelView';
import Wind from './Components/Wind';
import SunTime from './Components/SunTime';

import WeatherContext, { useWeather } from './Components/WeatherContext'
import { WeatherData } from './ts/WeatherData';

//Icons
import * as WidgetIcons from './svgs/widget/widget.svgs'

const DayValues = () => {
    const forecastData = useWeather().forecast;

    return (
        <>
            <SimpleInfoWidget icon={<WidgetIcons.Droplet />} title="Precipitation" value={`${forecastData.hourly.precipitation[forecastData.nowIndex]}"`} />
            <SimpleInfoWidget icon={<WidgetIcons.Thermometer />} title="Dew Point" value={`${forecastData.hourly.dewpoint_2m[forecastData.nowIndex]}°`} />
            <SimpleInfoWidget icon={<WidgetIcons.Moisture />} title="Humidity" value={`${forecastData.hourly.relativehumidity_2m[forecastData.nowIndex]}%`} />
            <SimpleInfoWidget icon={<WidgetIcons.Eye />} title="Visibility" value={`${WeatherData.ToKM(forecastData.hourly.visibility[forecastData.nowIndex])} km`} />
        </>
    )
}

const AirUV = () => {
    const forecastData = useWeather().forecast;
    const airqualityData = useWeather().airQuality.hourly;

    const AQ = Math.round(airqualityData.us_aqi[forecastData.nowIndex])
    const UV = Math.round(airqualityData.uv_index[forecastData.nowIndex])

    return (
        <>
            <HazardLevelView info={WeatherData.GetAQInfo(AQ)} />
            <HazardLevelView info={WeatherData.GetUVInfo(UV)} />
        </>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <>
        <WeatherContext>
            <Now/>
            <Hourly />
            <Daily />
            <Radar />
            <SunTime/>
            <AirUV />
            <DayValues/>
            <Wind/>
            {/* <Alert type={AlertTypes.WARNING} name="Tornado Warning" message="Seek shelter in a center room or basement. Stay away from windows and keep head down."/> */}
            {/* <div id="panel">
                <div id="panel-left">
                    <Hourly/>
                    <Daily/>
                    <Radar />
                    <DayValues />`
                </div>
                <div id="panel-right">
                    
                </div>`
            </div> */}
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
