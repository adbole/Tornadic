import React from "react";
import styled from "@emotion/styled";

import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import GaugeWidget from "Components/GagueWidget";
import HazardLevel from "Components/HazardLevel";
import { Button } from "Components/Input";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import SimpleInfoWidget from "Components/SimpleInfoWidget";
import SkeletonWidget from "Components/SkeletonWidget";
import { WidgetStyle } from "Components/Widget";
import Wind from "Components/Wind";
import { ExclamationTriangle } from "svgs";
import { Droplet, Eye, Moisture, Thermometer } from "svgs/widget";

import type { ModalProps } from "./Modal";
import Modal, { ModalContent } from "./Modal";


const PeekContent = styled(ModalContent)({
    padding: 0,

    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridAutoRows: "auto",

    [`${WidgetStyle}`]: {
        backdropFilter: "none",
        boxShadow: "none",
        minHeight: "150px",
    },

    [`${Now.Style}, ${Alert.Style}`]: {
        gridColumn: "span 4",
        borderRadius: 0,
    },

    [`${WidgetStyle}:nth-of-type(n+ 7)`]: { gridColumn: "span 2" },
});

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
                            <SkeletonWidget className="now" size="widget-large" />
                            <SkeletonWidget className="alert" size="widget-wide" />

                            {Array.from({ length: 4 }, (_, i) => (
                                <SkeletonWidget key={i} />
                            ))}

                            {Array.from({ length: 4 }, (_, i) => (
                                <SkeletonWidget className="wind" key={i} />
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
            </PeekContent>
        </Modal>
    );
}
