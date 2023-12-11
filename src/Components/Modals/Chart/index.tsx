import React from "react";
import type { YAxisProps } from "recharts";
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useReadLocalStorage } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import { InputGroup, ToggleButton } from "Components/Input";
import type { ModalProps } from "Components/Modals/Modal";
import { ModalTitle } from "Components/Modals/Modal";

import getTimeFormatted from "ts/TimeConversion";
import type Weather from "ts/Weather";
import type { CombinedHourly } from "ts/Weather";

import ChartVisualization from "./__internal__/ChartVisualization";
import { Axes, ChartContext } from "./__internal__";
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

function getMinMax([min, max]: [number, number], property: ChartViews): [number, number] {
    switch (property) {
        case "surface_pressure":
            return [min - 0.3, max + 0.3];
        case "precipitation":
            return [0, Math.max(0.5, max + 0.25)];
        case "relativehumidity_2m":
            return [0, 100];
        case "uv_index":
            return [0, Math.max(11, max)];
        default:
            return [Math.floor(min / 10) * 10, Math.ceil(max / 10) * 10 + 10];
    }
}

export default function Chart({
    showView,
    showDay = 0,
    ...modalProps
}: { showView: ChartViews; showDay?: number } & ModalProps) {
    const { weather } = useWeather();
    const [view, setView] = React.useState(showView);
    const [day, setDay] = React.useState(showDay);

    const radioId = React.useId();
    const timeRef = React.useRef<HTMLSpanElement>(null);



    //Ensure the current prop value is used when opened or changed
    React.useEffect(() => setDay(showDay), [showDay, modalProps.isOpen]);

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

    // const setTimeText = React.useCallback(
    //     (s: string) => {
    //         if (!timeRef.current) return;

    //         timeRef.current.innerText = s;
    //     },
    //     [timeRef]
    // );

    // const onMouseMove = React.useCallback(
    //     (e: any) => (e.activeLabel ? setTimeText(", " + e.activeLabel) : setTimeText("")),
    //     [setTimeText]
    // );
    // const onMouseLeave = React.useCallback(() => setTimeText(""), [setTimeText]);

    // const yAxisProps: YAxisProps = {
    //     width: 50,
    //     domain: ([dataMin, dataMax]) => getMinMax([dataMin, dataMax], view),
    // };

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

                <p>
                    {getTimeFormatted(weather.getForecast("time", day * 24), "date")}
                    <span ref={timeRef} />
                </p>

                <ChartContext view={view} day={day}>
                    <Axes />
                    <ChartVisualization />
                </ChartContext>
            </ChartContent>
        </ChartModal>
    );
}
