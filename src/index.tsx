//React
import ReactDOM from 'react-dom/client';
import React from 'react';

//Components
import App from 'App';
import MessageScreen from 'Components/MessageScreen';
import { WifiOff } from 'svgs';
import { ExclamationTriangle } from 'svgs';
import { Cursor } from 'svgs/radar';

const Index = () => {
    const [online, setOnline] = React.useState(navigator.onLine);

    //Before tornadic can load, it needs location permissions. 
    //Check if it has been authorized
    const [permissionStatus, setPermissionStatus] = React.useState<PermissionState | null>(null);

    React.useEffect(() => {
        navigator.permissions.query({name: "geolocation"}).then(status => setPermissionStatus(status.state));

        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if(online) {
        if(permissionStatus === null) {
            return null;
        }
        else if(permissionStatus === "prompt") {
            return (
                <MessageScreen>
                    <Cursor/>
                    <p>Tornadic requires location permissions to provide forcasts for your area.</p>
                    <div>
                        <button type="button" onClick={() => navigator.geolocation.getCurrentPosition(() => setPermissionStatus("granted"), () => setPermissionStatus("denied"))}>Provide Location</button>
                    </div>
                </MessageScreen>
            );
        }
        else if(permissionStatus === "denied") {
            return (
                <MessageScreen>
                    <ExclamationTriangle/>
                    <p>Tornadic does not have permission to access your location</p>
                </MessageScreen>
            );
        }
        else {
            return <App/>;
        }
    }
    else {
        return (
            <>
                <MessageScreen>
                    <WifiOff/>
                    <p>Tornadic requires an internet connection to function properly</p>
                </MessageScreen>
            </>
        );
    }
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Index />);
