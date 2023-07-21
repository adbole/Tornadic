import { useOnlineOffline } from "Hooks";

import ModalContext, { useModal } from "Contexts/ModalContext";
import { useSettings } from "Contexts/SettingsContext";
import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import Daily from "Components/Daily";
import HazardLevel from "Components/HazardLevel";
import Hourly from "Components/Hourly";
import { Button } from "Components/Input";
import LocationModal from "Components/LocationModal";
import MessageScreen from "Components/MessageScreen";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import Radar from "Components/Radar";
import SunTime from "Components/SunTime";
import SimpleInfoWidget from "Components/Widget.SimpleInfo";
import Wind from "Components/Wind";
import { WifiOff } from "svgs";
import { Cursor } from "svgs/radar";
import * as WidgetIcons from "svgs/widget";


const LocationRequest = () => {
    const { showModal } = useModal();

    return (
        <MessageScreen>
            <Cursor/>
            <p>Tornadic requires you to provide a location in order to work properly.</p>
            <div>
                <Button onClick={() => navigator.geolocation.getCurrentPosition(() => showModal(<LocationModal />))}>Provide Location</Button>
            </div>
        </MessageScreen>
    );
};

const App = () => {
    const online = useOnlineOffline();
    const { settings: { user_location } } = useSettings();

    if(!online) {
        return (
            <MessageScreen>
                <WifiOff/>
                <p>Tornadic requires an internet connection to function properly</p>
            </MessageScreen>
        );
    }

    if(!user_location) {
        return (
            <ModalContext>
                <LocationRequest />
            </ModalContext>
        );
    }

    return (
        <>
            <WeatherContext>
                <ModalContext>
                    <Now/>
                    <Daily/>
                    <Radar/>
    
                    <Alert/>
                    <Hourly/>
    
                    <SimpleInfoWidget icon={<WidgetIcons.Droplet />} title="Precipitation" property={"precipitation"}/>
                    <SimpleInfoWidget icon={<WidgetIcons.Thermometer />} title="Dewpoint" property={"dewpoint_2m"}/>
                    <SimpleInfoWidget icon={<WidgetIcons.Moisture />} title="Humidity" property={"relativehumidity_2m"}/>
                    <SimpleInfoWidget icon={<WidgetIcons.Eye />} title="Visibility" property={"visibility"}/>
                    <HazardLevel hazard={"us_aqi"} />
                    <HazardLevel hazard={"uv_index"} />
                    
                    <Wind/>
                    <Pressure/>
                    <SunTime/>
                </ModalContext>
            </WeatherContext>
        </>
    );
};

export default App;
