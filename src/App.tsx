//Components
import Now from './Components/Now';
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';
import Radar from './Components/Radar/Radar';
import Wind from './Components/Wind';
import SunTime from './Components/SunTime';
import Alert from './Components/Alert/Alert';
import Pressure from './Components/Pressure';

//Contexes
import ModalContext from './Components/Contexes/ModalContext';
import WeatherContext from './Components/Contexes/Weather';
import { AirUV, DayValues } from './Components/SimpleComponents';

import React from 'react';
import MessageScreen from './Components/MessageScreen';
import { ExclamationTriangle } from './svgs';
import { Cursor } from './svgs/radar';

const App = () => {
    //Before tornadic can load, it needs location permissions. 
    //Check if it has been authorized
    const [permissionStatus, setPermissionStatus] = React.useState<PermissionState | null>(null);

    React.useEffect(() => {
        navigator.permissions.query({name: "geolocation"}).then(status => setPermissionStatus(status.state));
    }, []);

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
        return (
            <>
                <WeatherContext>
                    <ModalContext>
                            <Now/>
                            <Alert/>
                            <Hourly />
                            <DayValues/>
                            <AirUV />
                            <Daily />
                            <Radar />
                            <Wind/>
                            <Pressure/>
                            <SunTime/>
                    </ModalContext>
                </WeatherContext>
            </>
        );
    }
};

export default App;
