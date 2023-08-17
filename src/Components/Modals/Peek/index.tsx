import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
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

import PeekContent, { AlertSkeleton,NowSkeleton } from "./style";


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
                <WeatherContext
                    latitude={latitude}
                    longitude={longitude}
                    skeletonRender={() => (
                        <>
                            <NowSkeleton className="now" size="widget-large" />
                            <AlertSkeleton className="alert" />

                            {Array.from({ length: 4 }, (_, i) => (
                                <Skeleton key={i} />
                            ))}

                            {Array.from({ length: 4 }, (_, i) => (
                                <Skeleton key={i} />
                            ))}
                        </>
                    )}
                    fallbackRender={getData => (
                        <>
                            <ExclamationTriangle />
                            <p>Unable to get weater data</p>
                            <Button onClick={getData}>Try Again</Button>
                        </>
                    )}
                >
                    <Now className="now" displayOnly />
                    <Alert className="alert" />
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
            </PeekContent>
        </Modal>
    );
}
