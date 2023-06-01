//React
import ReactDOM from 'react-dom/client';
import React from 'react';
// import reportWebVitals from './reportWebVitals';

//Components
import App from './App';
import OfflineApp from './OfflineApp';

const OnlineOfflineManager = () => {
    const [online, setOnline] = React.useState(navigator.onLine);

    React.useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <>
            {online ? <App/> : <OfflineApp/>}
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <>
       <OnlineOfflineManager />
    </>
);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
