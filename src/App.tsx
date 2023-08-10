import React from "react";

import {
    useBooleanState,
    useLocalStorage,
    useOnlineOffline,
    usePermission,
    useReadLocalStorage,
} from "Hooks";

import WeatherContext from "Contexts/WeatherContext";

import {
    Alert,
    Button,
    Daily,
    HazardLevel,
    Hourly,
    LocationInput,
    MessageScreen,
    Modal,
    ModalContent,
    Now,
    Pressure,
    Radar,
    SimpleInfoWidget,
    SunTime,
    Wind,
} from "Components";
import { WifiOff } from "svgs";
import { Cursor } from "svgs/radar";
import * as WidgetIcons from "svgs/widget";


function LocationRequest() {
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    return (
        <>
            <MessageScreen>
                <Cursor />
                <p>Tornadic requires you to provide a location in order to work properly.</p>
                <div>
                    <Button onClick={showModal}>Provide Location</Button>
                </div>
            </MessageScreen>
            <Modal isOpen={modalOpen} onClose={hideModal}>
                <ModalContent>
                    <LocationInput />
                </ModalContent>
            </Modal>
        </>
    );
}

function App() {
    const online = useOnlineOffline();

    const locationPermission = usePermission("geolocation");
    const user_location = useReadLocalStorage("userLocation");

    const [settings, setSettings] = useLocalStorage("userSettings");

    React.useEffect(() => {
        setSettings(settings); // Save Defaults
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!online) {
        return (
            <MessageScreen>
                <WifiOff />
                <p>Tornadic requires an internet connection to function properly</p>
            </MessageScreen>
        );
    }

    if (!user_location || (user_location.useCurrent && locationPermission === "denied")) {
        return <LocationRequest />;
    }

    return (
        <>
            <WeatherContext>
                <Now />
                <Daily />
                <Radar />

                <Alert />
                <Hourly />

                <SimpleInfoWidget
                    icon={<WidgetIcons.Droplet />}
                    title="Precipitation"
                    property={"precipitation"}
                />
                <SimpleInfoWidget
                    icon={<WidgetIcons.Thermometer />}
                    title="Dewpoint"
                    property={"dewpoint_2m"}
                />
                <SimpleInfoWidget
                    icon={<WidgetIcons.Moisture />}
                    title="Humidity"
                    property={"relativehumidity_2m"}
                />
                <SimpleInfoWidget
                    icon={<WidgetIcons.Eye />}
                    title="Visibility"
                    property={"visibility"}
                />
                <HazardLevel hazard={"us_aqi"} />
                <HazardLevel hazard={"uv_index"} />

                <Wind />
                <Pressure />
                <SunTime />
            </WeatherContext>
        </>
    );
}

export default App;
