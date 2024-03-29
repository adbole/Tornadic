import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import { InputGroup, ToggleButton } from "Components/Input";
import type { ModalProps } from "Components/Modals/Modal";
import { ModalTitle } from "Components/Modals/Modal";

import getTimeFormatted from "ts/TimeConversion";
import type { CombinedHourly } from "ts/Weather";

import { Axes, ChartContext, ChartVisualization, NowReference, Tooltip } from "./__internal__";
import ChartModal, { ChartContent, Option } from "./style";


export type ChartViews = keyof Pick<
    CombinedHourly,
    | "temperature_2m"
    | "relativehumidity_2m"
    | "precipitation"
    | "dewpoint_2m"
    | "visibility"
    | "windspeed_10m"
    | "surface_pressure"
    | "us_aqi"
    | "uv_index"
>;

const CHART_VIEWS_TITLES: {
    readonly [x: string]: ChartViews;
} = {
    Temperature: "temperature_2m",
    Humidity: "relativehumidity_2m",
    Precipitation: "precipitation",
    Dewpoint: "dewpoint_2m",
    Visibility: "visibility",
    Windspeed: "windspeed_10m",
    Pressure: "surface_pressure",
    Air_Quality: "us_aqi",
    UV_Index: "uv_index",
} as const;

export type DataPoint = {
    x: Date;
    y1: number;
    y2: number | null;
};

export default function Chart({
    showView,
    showDay = 0,
    ...modalProps
}: { showView: ChartViews; showDay?: number } & Omit<ModalProps, "children">) {
    const { weather } = useWeather();
    const [view, setView] = React.useState(showView);
    const [day, setDay] = React.useState(showDay);

    const radioId = React.useId();

    //Ensure the current prop values are used when opened
    React.useEffect(() => {
        setView(showView);
        setDay(showDay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalProps.isOpen]);

    //Autosize the select element for style points
    const setWidth = React.useCallback((element: HTMLSelectElement) => {
        if (element === null) return;

        const canvasContext = document.createElement("canvas").getContext("2d")!;
        canvasContext.font = getComputedStyle(element).font;

        //In case textContent is null Temperature is default since its the largest option
        const width = canvasContext.measureText(
            element.children[element.selectedIndex].textContent ?? "Temperature"
        ).width;

        element.style.width = Math.round(width) + 30 + "px";
    }, []);

    return (
        <ChartModal {...modalProps}>
            <ModalTitle>
                <select
                    ref={setWidth}
                    title="Current Chart"
                    onChange={e => {
                        setView(e.currentTarget.value as ChartViews);
                        setWidth(e.currentTarget);
                    }}
                    value={view}
                >
                    {Object.keys(CHART_VIEWS_TITLES).map(key => (
                        <Option key={key} value={CHART_VIEWS_TITLES[key]}>
                            {key.replace("_", " ")}
                        </Option>
                    ))}
                </select>
            </ModalTitle>
            <ChartContent>
                <InputGroup isUniform hasGap style={{ width: "100%" }}>
                    {weather.getAllDays("time").map((time, i) => (
                        <ToggleButton
                            key={time}
                            name={radioId}
                            label={getTimeFormatted(time, "weekday")}
                            onClick={() => setDay(i)}
                            defaultChecked={i === day}
                        />
                    ))}
                </InputGroup>

                <p>{getTimeFormatted(weather.getForecast("time", day * 24), "date")}</p>

                <ChartContext view={view} day={day}>
                    <Axes />
                    <ChartVisualization />
                    <NowReference isShown={!day} />
                    <Tooltip day={day} />
                    <line x1={0} x2="100%" y1={100} y2={100} stroke="#ffffff19" strokeWidth={1} />
                </ChartContext>
            </ChartContent>
        </ChartModal>
    );
}
