//React
import ReactDOM from 'react-dom/client';
import React from 'react';

//Components
import App from 'App';
import MessageScreen from 'Components/MessageScreen';
import { WifiOff } from 'svgs';
import { ExclamationTriangle } from 'svgs';
import { Cursor } from 'svgs/radar';
import { useBooleanState, useNullableState } from 'Hooks';

const Index = () => {
    const [online, setOnlineTrue, setOnlineFalse] = useBooleanState(navigator.onLine);

    //Before tornadic can load, it needs location permissions. 
    //Check if it has been authorized
    const [permissionStatus, setPermissionStatus] = useNullableState<PermissionState>();

    React.useEffect(() => {
        navigator.permissions.query({name: "geolocation"}).then(status => setPermissionStatus(status.state));

        window.addEventListener("online", setOnlineTrue);
        window.addEventListener("offline", setOnlineFalse);

        return () => {
            window.removeEventListener("online", setOnlineTrue);
            window.removeEventListener("offline", setOnlineFalse);
        };
    }, [setOnlineFalse, setOnlineTrue, setPermissionStatus]);

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
