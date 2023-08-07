import { useBooleanState, useLocalStorage, useOnlineOffline } from "Hooks";

import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import Daily from "Components/Daily";
import HazardLevel from "Components/HazardLevel";
import Hourly from "Components/Hourly";
import { Button, LocationInput } from "Components/Input";
import MessageScreen from "Components/MessageScreen";
import Modal, { ModalContent } from "Components/Modals/Modal";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import Radar from "Components/Radar";
import SunTime from "Components/SunTime";
import SimpleInfoWidget from "Components/Widget.SimpleInfo";
import Wind from "Components/Wind";
import { WifiOff } from "svgs";
import { Cursor } from "svgs/radar";
import * as WidgetIcons from "svgs/widget";

import { USER_SETTINGS_DEFAULT } from "ts/LocalStorageDefaults";


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
    const [{ user_location }] = useLocalStorage("userSettings", USER_SETTINGS_DEFAULT)

    if (!online) {
        return (
            <MessageScreen>
                <WifiOff />
                <p>Tornadic requires an internet connection to function properly</p>
            </MessageScreen>
        );
    }

    if (!user_location) {
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
