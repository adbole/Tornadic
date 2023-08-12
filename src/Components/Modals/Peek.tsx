import React from "react";

import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import HazardLevel from "Components/HazardLevel";
import { Button } from "Components/Input";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import SimpleInfoWidget from "Components/SimpleInfoWidget";
import SkeletonWidget from "Components/SkeletonWidget";
import Wind from "Components/Wind";
import { ExclamationTriangle } from "svgs";
import { Droplet, Eye, Moisture, Thermometer } from "svgs/widget";

import type { ModalProps } from "./Modal";
import Modal, { ModalContent } from "./Modal";


export default function Peek({
    latitude,
    longitude,
    ...modalProps
}: {
    latitude?: number;
    longitude?: number;
} & ModalProps) {
    return (
        <Modal id="peek" {...modalProps}>
            <ModalContent>
                <WeatherContext 
                    latitude={latitude} 
                    longitude={longitude}
                    skeletonRender={
                        () => (
                            <>
                                <SkeletonWidget size="widget-large" />
                                <SkeletonWidget size="widget-wide" />
                                {
                                    Array.from({ length: 6 }, (_, i) => <SkeletonWidget key={i}/>)
                                }
                            </>
                        )
                    }
                    fallbackRender={
                        (getData) => (
                            <>
                                <ExclamationTriangle />
                                <p>Unable to get weater data</p>
                                <Button onClick={getData}>Try Again</Button>
                            </>
                        )
                    }
                >
                    <Now displayOnly/>
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
                    <SimpleInfoWidget
                        icon={<Eye />}
                        title="Visibility"
                        property="visibility"
                    />

                    <HazardLevel hazard="us_aqi"/>
                    <HazardLevel hazard="uv_index"/>

                    <Wind />
                    <Pressure />
                </WeatherContext>
            </ModalContent>
        </Modal>
    );
}
