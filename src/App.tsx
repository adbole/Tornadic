import React from "react";
import styled from "@emotion/styled";

import { useBooleanState, useLocalStorage, useOnlineOffline, useUserLocation } from "Hooks";

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
    SkeletonWidget,
    SunTime,
    Wind,
} from "Components";
import { ExclamationTriangle, Spinner, WifiOff } from "svgs";
import { Cursor } from "svgs/radar";
import * as WidgetIcons from "svgs/widget";

import { mediaQueries } from "ts/StyleMixins";


const HourlySkeleton = styled(SkeletonWidget)({ [mediaQueries.large]: { gridColumn: "span 6" } })
const RadarSkeleton = styled(SkeletonWidget)(Radar.Style)
const DailySkeleton = styled(SkeletonWidget)(Daily.Style)

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

function Skeleton() {
    return (
        <>
            <SkeletonWidget size={"widget-large"} />
            <HourlySkeleton size={"widget-wide"} />
            <DailySkeleton size={"widget-large"} />
            <RadarSkeleton size="widget-large"/>
            {Array.from({ length: 8 }, (_, i) => (
                <SkeletonWidget key={i} />
            ))}
            <SkeletonWidget size={"widget-wide"} />
        </>
    );
}

function App() {
    const online = useOnlineOffline();
    const { latitude, longitude, status } = useUserLocation();
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

    if (status !== "getting_current" && status !== "OK") {
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

    if (!latitude || !longitude) return null;

    return (
        <WeatherContext
            latitude={latitude}
            longitude={longitude}
            skeletonRender={Skeleton}
            fallbackRender={getData => (
                <MessageScreen>
                    <ExclamationTriangle />
                    <p>Unable to get weather data</p>
                    <Button onClick={getData}>Try Again</Button>
                </MessageScreen>
            )}
        >
            <Now />
            <Alert />
            <Hourly />
            <Daily />
            <Radar />

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
    );
}

export default App;
