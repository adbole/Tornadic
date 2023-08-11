import React from "react";

import { Sun } from "svgs/conditions";
import { Droplet, Eye, Lungs, Meter, Moisture, Thermometer, Wind } from "svgs/widget";

import type { CombinedHourly } from "ts/Weather";

import type { ModalProps } from "../Modal";
import Modal, { ModalContent } from "../Modal";

import Alert from "./Alert";
import Now from "./Now";
import PeekContext, { usePeekWeather } from "./PeekContext";


function PeekItem({
    icon,
    title,
    hourlyProp,
}: {
    icon: React.ReactNode;
    title: string;
    hourlyProp: keyof CombinedHourly;
}) {
    const { weather } = usePeekWeather();

    let value = weather.getForecast(hourlyProp);

    if(typeof value === "number") {
        value = value.toFixed(1)
    }

    return (
        <div className="peek-item">
            {icon}
            <div>
                <p>
                    {value}
                    {weather.getForecastUnit(hourlyProp)}
                </p>
                <p>{title}</p>
            </div>
        </div>
    );
}

export default function PeekModal({
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
                <PeekContext latitude={latitude} longitude={longitude}>
                    <Now />
                    <Alert />
                    <div className="peek-items">
                        <PeekItem
                            icon={<Droplet />}
                            title="Precipitation"
                            hourlyProp="precipitation"
                        />
                        <PeekItem
                            icon={<Thermometer />}
                            title="Dewpoint"
                            hourlyProp="dewpoint_2m"
                        />
                        <PeekItem
                            icon={<Moisture />}
                            title="Humidity"
                            hourlyProp="relativehumidity_2m"
                        />
                        <PeekItem
                            icon={<Eye />}
                            title="Visibility"
                            hourlyProp="visibility"
                        />
                        <PeekItem
                            icon={<Lungs />}
                            title="Air Quality"
                            hourlyProp="us_aqi"
                        />
                        <PeekItem
                            icon={<Sun />}
                            title="UV Index"
                            hourlyProp="uv_index"
                        />
                        <PeekItem
                            icon={<Wind />}
                            title="Wind Speed"
                            hourlyProp="windspeed_10m"
                        />
                        <PeekItem
                            icon={<Meter />}
                            title="Air Pressure"
                            hourlyProp="surface_pressure"
                        />
                    </div>
                </PeekContext>
            </ModalContent>
        </Modal>
    );
}
