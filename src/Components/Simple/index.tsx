import React from "react";
import styled from "@emotion/styled";

import { useBooleanState, useReadLocalStorage } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import ChartModal from "Components/Modals/Chart";
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
        marginRight: "10px",
    },
});

const Title = styled(WidgetTitle)({ margin: 0 });

const Value = styled.p({ fontSize: "1.75rem" });

function getRoundingMethod(property: ChartViews, settings: UserSettings) {
    if (property === "precipitation" && settings.precipitation === "inch") {
        return trunc;
    }

    return Math.round;
}

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

    const settings = useReadLocalStorage("userSettings");

    if (!settings) return null;

    return (
        <>
            <SimpleWidget isTemplate onClick={showModal}>
                {icon}
                <div>
                    <Title>{title}</Title>
                    <Value>
                        {getRoundingMethod(property, settings)(weather.getForecast(property))}
                        {weather.getForecastUnit(property)}
                    </Value>
                </div>
            </SimpleWidget>
            <ChartModal showView={property} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
