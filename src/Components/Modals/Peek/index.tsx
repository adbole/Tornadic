import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import FetchErrorHandler from "Components/FetchErrorHandler";
import HazardLevel from "Components/HazardLevel";
import { Button } from "Components/Input";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import SimpleInfoWidget from "Components/Simple";
import Skeleton from "Components/Skeleton";
import Wind from "Components/Wind";
import { ExclamationTriangle } from "svgs";
import { Droplet, Eye, Moisture, Thermometer } from "svgs/widget";

import type { ModalProps } from "../Modal";
import Modal from "../Modal";

import PeekContent, { AlertSkeleton, ErrorMessage, NowSkeleton } from "./style";


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
                        skeletonRender={() => (
                            <>
                                <NowSkeleton size="widget-large" />
                                <AlertSkeleton size="widget-wide" />

                                {Array.from({ length: 8 }, (_, i) => (
                                    <Skeleton key={i} />
                                ))}
                            </>
                        )}
                    >
                        <Now displayOnly />
                        <Alert />
                        <SimpleInfoWidget
                            icon={<Droplet />}
                            title="Precipitation"
                            property="precipitation"
                        />
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
                        <SimpleInfoWidget icon={<Eye />} title="Visibility" property="visibility" />

                        <HazardLevel hazard="us_aqi" />
                        <HazardLevel hazard="uv_index" />

                        <Wind />
                        <Pressure />
                    </WeatherContext>
                </FetchErrorHandler>
            </PeekContent>
        </Modal>
    );
}
