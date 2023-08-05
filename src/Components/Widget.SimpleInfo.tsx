import React from "react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart, { ChartViews } from "Components/Chart";

import Widget from "./Widget";


export default function SimpleInfoWidget({
    icon,
    title,
    property,
}: {
    icon: React.ReactNode;
    title: string;
    property: ChartViews;
}) {
    const { weather } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    return (
        <>
            <Widget className="basic-info" isTemplate onClick={showModal}>
                {icon}
                <h1 className="widget-title">{title}</h1>
                <p>
                    {weather.getForecast(property).toFixed(0) + weather.getForecastUnit(property)}
                </p>
            </Widget>
            <Chart showView={property} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
