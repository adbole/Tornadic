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
    Simple,
    Skeleton,
    SunTime,
    Wind,
} from "Components";
import FetchErrorHandler from "Components/FetchErrorHandler";
import Toast from "Components/Toast";
import { Spinner, WifiOff } from "svgs";
import { Cursor } from "svgs/radar";
import * as WidgetIcons from "svgs/widget";

import { mediaQueries } from "ts/StyleMixins";


const NowSkeleton = styled(Skeleton)({ [mediaQueries.max("medium")]: { gridColumn: "1 / -1" } });
const HourlySkeleton = styled(Skeleton)({ [mediaQueries.min("large")]: { gridColumn: "span 6" } });
const RadarSkeleton = styled(Skeleton)({ [mediaQueries.min("medium")]: { gridArea: "r" } });
const DailySkeleton = styled(Skeleton)({ [mediaQueries.min("medium")]: { gridArea: "d" } });

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

function AppLoader() {
    return (
        <>
            <NowSkeleton size="widget-large" />
            <HourlySkeleton size="widget-wide" />
            <DailySkeleton size="widget-large" />
            <RadarSkeleton size="widget-large" />
            {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} />
            ))}
            <Skeleton size="widget-wide" />
        </>
    );
}

function App() {
    const online = useOnlineOffline();
    const { latitude, longitude, status } = useUserLocation();
    
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
        <FetchErrorHandler
            errorRender={(hasError, retry) => (
                <Toast
                    isOpen={hasError}
                    action={{
                        content: "Try Again",
                        onClick: retry,
                    }}
                >
                    Could not get weather data
                </Toast>
            )}
        >
            <WeatherContext latitude={latitude} longitude={longitude} skeletonRender={AppLoader}>
                <Now />
                <Alert />
                <Hourly />
                <Daily />
                <Radar />

                <Simple
                    icon={<WidgetIcons.Droplet />}
                    title="Precipitation"
                    property="precipitation"
                />
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
                <Simple icon={<WidgetIcons.Eye />} title="Visibility" property="visibility" />
                <HazardLevel hazard="us_aqi" />
                <HazardLevel hazard="uv_index" />

                <Wind />
                <Pressure />
                <SunTime />
            </WeatherContext>
        </FetchErrorHandler>
    );
}

export default App;
