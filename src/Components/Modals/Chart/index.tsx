import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import { Ensemble, Standard } from "Components/Chart/Variants";
import { InputGroup, ToggleButton } from "Components/Input";
import type {ModalProps} from "Components/Modals/Modal";
import { Ensemble as EnsembleSVG } from "svgs";

import { varNames } from "ts/StyleMixins";
import getTimeFormatted from "ts/TimeConversion";
import type { CombinedHourly } from "ts/Weather";

import StyledModal, { ChartContent, ChartTitle, Option } from "./style";


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

export default function ChartModal({
    showView,
    showDay = 0,
    ...modalProps
}: { showView: ChartViews; showDay?: number } & Omit<ModalProps, "children">) {
    const { weather } = useWeather();
    const [view, setView] = React.useState(showView);
    const [day, setDay] = React.useState(showDay);
    const [showEnsemble, setShowEnsemble] = React.useState(false);

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
        <StyledModal {...modalProps}>
            <ChartTitle>
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
                <ToggleButton 
                    type="checkbox"
                    title="Toggle Ensemble data on or off"
                    onClick={({ currentTarget: { checked } }) => setShowEnsemble(checked)}
                    label={<EnsembleSVG />}
                    style={{ 
                        padding: "10px",
                        [varNames.svgSize]: "1.5rem",
                    }}
                />
            </ChartTitle>
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

                {
                    showEnsemble
                        ? <Ensemble view={view} day={day} />
                        : <Standard view={view} day={day} />
                }
            </ChartContent>
        </StyledModal>
    );
}
