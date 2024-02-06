import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import Background from "Components/Background";
import Daily from "Components/Daily";
import FetchErrorHandler from "Components/FetchErrorHandler";
import HazardLevel from "Components/HazardLevel";
import Hourly from "Components/Hourly";
import { Button } from "Components/Input";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import SimpleInfoWidget from "Components/Simple";
import SimpleGroup from "Components/Simple/Group";
import Skeleton from "Components/Skeleton";
import SunTime from "Components/SunTime";
import Wind from "Components/Wind";
import { ExclamationTriangle } from "svgs";
import { Droplet, Eye, Moisture, Thermometer } from "svgs/widget";

import type { ModalProps } from "../Modal";
import Modal from "../Modal";

import PeekContent, { ErrorMessage } from "./style";


function PeekLoader() {
    return (
        <>
        <Skeleton size="widget-large" />
        <Skeleton size="widget-wide" />
        <Skeleton size="widget-large" />
        {Array.from({ length: 2 }, (_, i) => (
            <SimpleGroup key={i}>
                <Skeleton />
                <Skeleton />
            </SimpleGroup>
        ))}
        {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} />
        ))}
        <Skeleton size="widget-wide" />
    </>
    )
}

export default function Peek({
    latitude,
    longitude,
    ...modalProps
}: {
    latitude?: number;
    longitude?: number;
} & ModalProps) {
    return (
        <Modal {...modalProps}>
            <PeekContent>
                <FetchErrorHandler
                    errorRender={(hasError, retry) => (
                        <ErrorMessage style={{ display: hasError ? "" : "none" }}>
                            <ExclamationTriangle />
                            <span>Couldn't get weather info</span>
                            <Button onClick={retry}>Try Again</Button>
                        </ErrorMessage>
                    )}
                >
                    <WeatherContext
                        latitude={latitude}
                        longitude={longitude}
                        skeleton={<PeekLoader />}
                    >
                        <Now displayOnly />
                        <Background />
                        <Alert />
                        <Hourly />
                        <Daily />
                        
                        <SimpleGroup>
                            <SimpleInfoWidget
                                icon={<Droplet />}
                                title="Precipitation"
                                property="precipitation"
                            />
                            
                            <SimpleInfoWidget icon={<Eye />} title="Visibility" property="visibility" />
                        </SimpleGroup>

                        <SimpleGroup>
                            <SimpleInfoWidget
                                icon={<Thermometer />}
                                title="Dewpoint"
                                property="dewpoint_2m"
                            />
                            <SimpleInfoWidget
                                icon={<Moisture />}
                                title="Humidity"
                                property="relativehumidity_2m"
                            />
                        </SimpleGroup>

                        <HazardLevel hazard="us_aqi" />
                        <HazardLevel hazard="uv_index" />

                        <Wind />
                        <Pressure />
                        <SunTime />
                    </WeatherContext>
                </FetchErrorHandler>
            </PeekContent>
        </Modal>
    );
}
