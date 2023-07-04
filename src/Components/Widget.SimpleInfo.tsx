import React from "react";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart, { ChartViews } from "Components/Chart";

import Widget from "./Widget";


const SimpleInfoWidget = ({ icon, title, property }: {
    icon: React.ReactNode,
    title: string,
    property: ChartViews
}) => {
    const { weather } = useWeather();
    const { showModal } = useModal();

    return (
        <Widget className="basic-info" isTemplate onClick={() => showModal(<Chart showView={property}/>)}>
            {icon}
            <h1 className='widget-title'>{title}</h1>
            <p>{weather.getForecast(property).toFixed(0) + weather.getForecastUnit(property)}</p>
        </Widget>
    );
};

export default SimpleInfoWidget;
