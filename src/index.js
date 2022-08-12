//React
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

//Components
import Alert from './Components/Alert'
import Now from './Components/Now'
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';

const root = ReactDOM.createRoot(document.querySelector('body'));
root.render(
  <React.StrictMode>
    <Now />
    <Alert type="warning" name="Tornado Warning" message="Seek shelter in a center room or basement. Stay away from windows and keep head down."/>
    <div id="panel">
      <Hourly message="Slight chance for rain and thunderstorms after 4 AM."/>
      <Daily globalLow={80} globalHigh={100}/>
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
