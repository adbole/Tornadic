//React
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

//Components
import Alert from './Components/Alert'
import Now from './Components/Now'
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';
import Radar from './Components/Radar';
import { BasicInfoView } from './Components/BaseComponents';

//Icons
import {ReactComponent as Tornadic} from './svgs/Tornadic.svg'

const root = ReactDOM.createRoot(document.querySelector('body'));
root.render(
  <React.StrictMode>
    <Now location="Oklahoma City" currentTemp={90} status="sunny" feelsTemp={95}/>
    <Alert type="warning" name="Tornado Warning" message="Seek shelter in a center room or basement. Stay away from windows and keep head down."/>
    <div id="panel">
      <Hourly message="Slight chance for rain and thunderstorms after 4 AM."/>
      <Daily globalLow={80} globalHigh={100}/>
      <Radar />
      <BasicInfoView icon={<Tornadic />} title="Chance of Rain" value="50%" />
      <BasicInfoView icon={<Tornadic />} title="Dew Point" value="50°" />
      <BasicInfoView icon={<Tornadic />} title="Humidity" value="50%" />
      <BasicInfoView icon={<Tornadic />} title="Visibility" value="10 mi" />
      <BasicInfoView icon={<Tornadic />} title="Haines Index" value="1" />
    </div>
  </React.StrictMode>
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
reportWebVitals();
