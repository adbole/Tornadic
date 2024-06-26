import React from "react";

import { useBooleanState, useReadLocalStorage } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import ChartModal from "Components/Modals/Chart";
import { Calendar } from "svgs/widget";

import { Normalize, toHSL } from "ts/Helpers";
import { varNames } from "ts/StyleMixins";
import type { DayInfo } from "ts/Weather";

import DailyWidget, { Column, Covered, DualRange, List, Row } from "./style";

/**
 * A helper component for Daily to display the individual days of the week
 * @returns A single day as a table row entry
 */
function Day({
    dayInfo,
    style,
    onClick,
}: {
    dayInfo: DayInfo;
    style: React.CSSProperties;
    onClick: (e: React.MouseEvent<HTMLTableRowElement>) => void;
}) {
    return (
        <Row onClick={onClick}>
            <Column style={{ flex: "1 1" }}>
                <p>{dayInfo.day}</p>
            </Column>
            <Column style={{ flex: "1 0", [varNames.svgSize]: "1.5rem" }}>
                <dayInfo.conditionInfo.icon />
                {dayInfo.has_chance_of_rain && <span>{dayInfo.precipitation_probability}%</span>}
            </Column>
            <Column style={{ flex: "0 0 55%" }}>
                <p>{dayInfo.temperature_low}°</p>
                <DualRange>
                    <Covered style={style} />
                </DualRange>
                <p>{dayInfo.temperature_high}°</p>
            </Column>
        </Row>
    );
}

/**
 * Displays the week's temperatures and conditions along with the highest and lowest temp across the week.
 * @returns The Daily widget
 */
export default function Daily() {
    const { weather } = useWeather();
    const { tempUnit } = useReadLocalStorage("userSettings")!;

    const [chartOpen, showChart, hideChart] = useBooleanState(false);
    const chartDay = React.useRef(0);

    const dailyValues = [...weather.getDailyValues()];

    const low_week = Math.min(...dailyValues.map(day => day.temperature_low));
    const high_week = Math.max(...dailyValues.map(day => day.temperature_high));

    const calculateDualRangeCoverStyle = React.useCallback(
        (min: number, max: number) => {
            min = Math.max(0, min);
            max = Math.min(120, max);

            const minHSL = toHSL(min, tempUnit);
            const maxHSL = toHSL(max, tempUnit);

            return {
                left: Normalize.Percent(min, low_week, high_week) + "%",
                right: 100 - Normalize.Percent(max, low_week, high_week) + "%",
                backgroundImage: `linear-gradient(90deg, ${minHSL} 0%, ${maxHSL} 100%)`,
            };
        },
        // We don't change the function unless new data comes in or the low or high changes
        // a unit change causes new data to be fetched so we should wait for the new data before recalculating
        // the gradient otherwise a high fahrenheit value would show up as red due to celcius now being used.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [weather, low_week, high_week]
    );

    return (
        <>
            <DailyWidget size="widget-large" widgetTitle="7-Day Forecast" widgetIcon={<Calendar />}>
                <List>
                    {dailyValues.map((day, index) => (
                        <Day
                            key={index}
                            dayInfo={day}
                            style={calculateDualRangeCoverStyle(
                                day.temperature_low,
                                day.temperature_high
                            )}
                            onClick={() => {
                                chartDay.current = index;
                                showChart();
                            }}
                        />
                    ))}
                </List>
            </DailyWidget>
            <ChartModal
                showView="temperature_2m"
                showDay={chartDay.current}
                isOpen={chartOpen}
                onClose={hideChart}
            />
        </>
    );
}
