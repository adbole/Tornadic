import React from "react";
import {
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    YAxisProps,
} from "recharts";

import { useSettings } from "Contexts/SettingsContext";
import { useWeather } from "Contexts/WeatherContext";

import { InputGroup } from "Components/Input";
import ToggleButton from "Components/Input/ToggleButton";
import Modal, { ModalContent, ModalProps, ModalTitle } from "Components/Modals/Modal";

import getTimeFormatted from "ts/TimeConversion";
import Weather, { CombinedHourly } from "ts/Weather";

import ChartDisplay from "./ChartDisplay";
import CustomTooltip from "./CustomTooltip";
import getDataVisual from "./getDataVisual";


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
    property: ChartViews;
    name: string;
    primaryKey: number;
    secondaryKey: number | null;
};

//Gets the data for the given day and property
function getData(weather: Weather, property: ChartViews, day: number) {
    const data: DataPoint[] = [];

    for (let i = 24 * day; i < 24 * (day + 1); ++i) {
        data.push({
            property,
            name: getTimeFormatted(weather.getForecast("time", i), "hour"),
            primaryKey: weather.getForecast(property, i),
            secondaryKey: getSecondaryKey(i),
        });
    }

    return data;

    //Some properties have secondary values
    function getSecondaryKey(i: number) {
        switch (property) {
            case "temperature_2m":
                return weather.getForecast("apparent_temperature", i);
            case "windspeed_10m":
                return weather.getForecast("windgusts_10m", i);
            default:
                return null;
        }
    }
}

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

    const { settings } = useSettings();

    const chartData = React.useMemo(() => getData(weather, view, day), [weather, view, day]);

    const timeRef = React.useRef<HTMLSpanElement>(null);
    const selectRef = React.useRef<HTMLSelectElement>(null);

    //Autosize the select element for style points
    React.useEffect(() => {
        if (!selectRef.current) return;

        const canvasContext = document.createElement("canvas").getContext("2d")!;
        canvasContext.font = getComputedStyle(selectRef.current).font;

        //Incase textContent is null Temperature is default since its the largest option
        const width = canvasContext.measureText(
            selectRef.current.children[selectRef.current.selectedIndex].textContent ?? "Temperature"
        ).width;

        selectRef.current.style.width = Math.round(width) + 30 + "px";
    }, [view, selectRef]);

    const setTimeText = React.useCallback(
        (s: string) => {
            if (!timeRef.current) return;

            timeRef.current.innerText = s;
        },
        [timeRef]
    );

    const onMouseMove = React.useCallback(
        (e: any) => (e.activeLabel ? setTimeText(", " + e.activeLabel) : setTimeText("")),
        [setTimeText]
    );
    const onMouseLeave = React.useCallback(() => setTimeText(""), [setTimeText]);

    const yAxisProps: YAxisProps = {
        width: 50,
        domain: ([dataMin, dataMax]) => getMinMax([dataMin, dataMax], view),
    };

    return (
        <Modal id="chart" {...modalProps}>
            <ModalTitle>
                <select
                    ref={selectRef}
                    className="clear"
                    title="Current Chart"
                    onChange={e => setView(e.currentTarget.value as ChartViews)}
                    value={view}
                >
                    {Object.keys(CHART_VIEWS_TITLES).map(key => (
                        <option key={key} value={CHART_VIEWS_TITLES[key]}>
                            {key.replace("_", " ")}
                        </option>
                    ))}
                </select>
            </ModalTitle>
            <ModalContent>
                <InputGroup isUniform hasGap>
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

                <ResponsiveContainer width={"100%"} height="100%">
                    <ChartDisplay
                        property={view}
                        data={chartData}
                        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                        onMouseMove={onMouseMove}
                        onMouseLeave={onMouseLeave}
                    >
                        {getDataVisual(weather.getForecastUnit(view), view, chartData, settings)}
                        <CartesianGrid stroke="#ffffff19" />
                        <XAxis dataKey="name" interval={5} textAnchor="start" />
                        {view === CHART_VIEWS_TITLES.Temperature ||
                        view === CHART_VIEWS_TITLES.Dewpoint ||
                        view === CHART_VIEWS_TITLES.Humidity ? (
                            <YAxis {...yAxisProps} unit={weather.getForecastUnit(view)} />
                        ) : (
                            <YAxis
                                {...yAxisProps}
                                tickFormatter={(value: number) =>
                                    (Math.round(value * 10) / 10).toString()
                                }
                            />
                        )}

                        <Tooltip
                            wrapperStyle={{ outline: "none" }}
                            position={{ x: "auto" as any, y: 10 }}
                            content={<CustomTooltip />}
                        />
                        {day === 0 && (
                            <ReferenceLine
                                x={getTimeFormatted(weather.getForecast("time"), "hour")}
                            />
                        )}
                    </ChartDisplay>
                </ResponsiveContainer>
            </ModalContent>
        </Modal>
    );
}
