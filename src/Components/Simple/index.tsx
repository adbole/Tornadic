import React from "react";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import type { ChartViews } from "Components/Modals/Chart";
import Chart from "Components/Modals/Chart";
import Widget from "Components/Widget";
import { WidgetTitle } from "Components/Widget/style";

import { trunc } from "ts/Helpers";


const SimpleWidget = styled(Widget)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    ">svg": { 
        height: "75%",
        width: "auto",
        marginRight: "10px"
    },
});

const Title = styled(WidgetTitle)({ margin: 0 })

const Value = styled.p({ fontSize: "2rem" })

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
            <SimpleWidget isTemplate onClick={showModal}>
                {icon}
                <div>
                    <Title>{title}</Title>
                    <Value>
                        {trunc(weather.getForecast(property)) + weather.getForecastUnit(property)}
                    </Value>
                </div>
            </SimpleWidget>
            <Chart showView={property} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
