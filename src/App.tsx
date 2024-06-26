import React from "react";

import { useBooleanState, useLocalStorage, useOnlineOffline, useUserLocation } from "Hooks";

import WeatherContext from "Contexts/WeatherContext";

import {
    Alert,
    Background,
    Button,
    Daily,
    FetchErrorHandler,
    HazardLevel,
    Hourly,
    LocationInput,
    MessageScreen,
    Modal,
    ModalContent,
    Now,
    Pressure,
    Radar,
    Simple,
    SimpleGroup,
    Skeleton,
    SunTime,
    Toast,
    Wind,
} from "Components";
import { Base as DailyBase } from "Components/Daily/style";
import { Base as HourlyBase } from "Components/Hourly/style";
import { Base as NowBase } from "Components/Now/style";
import { Base as RadarBase } from "Components/Radar/style";
import { Spinner, WifiOff } from "svgs";
import { Cursor } from "svgs/radar";
import * as WidgetIcons from "svgs/widget";


function LocationRequest() {
    const [modalOpen, showModal, hideModal] = useBooleanState(false);
    const { status } = useUserLocation();

    const errorMessage = React.useMemo(() => {
        switch (status) {
            case "denied":
                return "You have denied location access. To use your current location, please enable location access in your browser settings and refresh the page.";
            case "unavailable":
                return "Your location could not be determined at this time. Please try again later.";
            case "timeout":
                return "Your location could not be determined in a timely manner. Please try again later.";
            case "nav_not_supported":
                return "Your browser does not support location services. Please use a different browser or device to use your current location.";
            default:
                return null;
        }
    }, [status]);

    return (
        <>
            <MessageScreen>
                <Cursor />
                <p>Tornadic requires you to provide a location in order to work properly.</p>
                {errorMessage && <p>{errorMessage}</p>}
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

function AppLoader() {
    return (
        <>
            <Skeleton css={NowBase} size="widget-large" />
            <Skeleton css={HourlyBase} size="widget-wide" />
            <Skeleton css={DailyBase} size="widget-large" />
            <Skeleton css={RadarBase} size="widget-large" />
            {Array.from({ length: 2 }, (_, i) => (
                <SimpleGroup key={i}>
                    <Skeleton />
                    <Skeleton />
                </SimpleGroup>
            ))}
            {Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} />
            ))}
            <Skeleton size="widget-wide" />
            {Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} />
            ))}
        </>
    );
}

function App() {
    const online = useOnlineOffline();
    const { latitude, longitude, status } = useUserLocation();
    const rootRef = React.useRef(document.getElementById("root")!);

    //useLocalStorage here causes the default value to be set for useReadLocalStorage
    useLocalStorage("userSettings");

    if (!online) {
        return (
            <MessageScreen>
                <WifiOff />
                <p>Tornadic requires an internet connection to function properly</p>
            </MessageScreen>
        );
    }

    if (status !== "getting_current" && (latitude === undefined || longitude === undefined)) {
        return <LocationRequest />;
    }

    if (status === "getting_current") {
        return (
            <MessageScreen>
                <Spinner />
                <p>Getting Your Location</p>
            </MessageScreen>
        );
    }

    return (
        <FetchErrorHandler
            errorRender={(hasError, retry) => (
                <Toast
                    isOpen={hasError}
                    actions={[
                        {
                            content: "Try Again Now",
                            onClick: retry,
                        },
                    ]}
                >
                    Could not get weather data
                </Toast>
            )}
        >
            <WeatherContext latitude={latitude} longitude={longitude} skeleton={<AppLoader />}>
                <Background parentElement={rootRef.current} />

                <Now />
                <Alert />
                <Hourly />
                <Daily />
                <Radar />

                <SimpleGroup>
                    <Simple
                        icon={<WidgetIcons.Droplet />}
                        title="Precipitation"
                        property="precipitation"
                    />
                    <Simple icon={<WidgetIcons.Eye />} title="Visibility" property="visibility" />
                </SimpleGroup>
                <SimpleGroup>
                    <Simple
                        icon={<WidgetIcons.Thermometer />}
                        title="Dewpoint"
                        property="dewpoint_2m"
                    />
                    <Simple
                        icon={<WidgetIcons.Moisture />}
                        title="Humidity"
                        property="relativehumidity_2m"
                    />
                </SimpleGroup>
                <HazardLevel hazard="us_aqi" />
                <HazardLevel hazard="uv_index" />

                <SunTime />
                <Wind />
                <Pressure />
            </WeatherContext>
        </FetchErrorHandler>
    );
}

export default App;
