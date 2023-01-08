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
import SolarMoon from './Components/SolarMoon';

import PointContext from './Components/NWSContext'

//Icons
import {Tornadic} from './svgs/svgs'

const root = ReactDOM.createRoot(document.querySelector('body')!);
root.render(
    <>
        <PointContext>
            <Now location="Oklahoma City" currentTemp={90} status="Sunny" feelsTemp={95}/>
            <Alert type={AlertTypes.WARNING} name="Tornado Warning" message="Seek shelter in a center room or basement. Stay away from windows and keep head down."/>
            <div id="panel">
                <Hourly message="Slight chance for rain and thunderstorms after 4 AM."/>
                <Daily globalLow={80} globalHigh={100}/>
                <Radar />
                <SimpleInfoWidget icon={<Tornadic />} title="Chance of Rain" value="50%" />
                <SimpleInfoWidget icon={<Tornadic />} title="Dew Point" value="50°" />
                <SimpleInfoWidget icon={<Tornadic />} title="Humidity" value="50%" />
                <SimpleInfoWidget icon={<Tornadic />} title="Visibility" value="10 mi" />
                <SimpleInfoWidget icon={<Tornadic />} title="Haines Index" value="1" />
                <LevelWidget id="AQ" min={0} max={500} title="Air Quality" value={225} message="Hazardous" />
                <LevelWidget id="UV" min={0} max={11} title="UV Index" value={3} message="Extreme" />
                <Wind speed={12} deg={45}/>
                <SolarMoon sunset="7:00PM" sunrise="7:00AM"/>
            </div>
        </PointContext>
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
