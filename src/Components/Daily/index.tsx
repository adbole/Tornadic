import { useRef } from "react";

import { useBooleanState, useReadLocalStorage } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Modals/Chart";
import { Calendar } from "svgs/widget";

import { Normalize, toHSL } from "ts/Helpers";
import type { DayInfo } from "ts/Weather";

import DailyWidget, {
    Column,
    ConditionColumn,
    Covered,
    DualRange,
    List,
    Row,
    TempRangeColumn,
} from "./style";

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
            <Column flex="1 1">
                <p>{dayInfo.day}</p>
            </Column>
            <ConditionColumn flex="1 0">
                <dayInfo.conditionInfo.icon />
                {dayInfo.has_chance_of_rain && <span>{dayInfo.precipitation_probability}%</span>}
            </ConditionColumn>
            <TempRangeColumn flex="0 0 55%">
                <p>{dayInfo.temperature_low}°</p>
                <DualRange>
                    <Covered style={style} />
                </DualRange>
                <p>{dayInfo.temperature_high}°</p>
            </TempRangeColumn>
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
    const chartDay = useRef(0);

    const dailyValues = [...weather.getDailyValues()];

    const low_week = Math.min(...dailyValues.flatMap(day => day.temperature_low));
    const high_week = Math.max(...dailyValues.flatMap(day => day.temperature_high));

    const calculateDualRangeCoverStyle = (min: number, max: number) => {
        min = Math.max(0, min);
        max = Math.min(120, max);

        const minHSL = toHSL(min, tempUnit);
        const maxHSL = toHSL(max, tempUnit);

        return {
            left: Normalize.Percent(min, low_week, high_week) + "%",
            right: 100 - Normalize.Percent(max, low_week, high_week) + "%",
            backgroundImage: `linear-gradient(90deg, ${minHSL} 0%, ${maxHSL} 100%)`,
        };
    };

    return (
        <>
            <DailyWidget
                className="daily"
                size="widget-large"
                widgetTitle="7-Day Forecast"
                widgetIcon={<Calendar />}
            >
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
            <Chart
                showView="temperature_2m"
                showDay={chartDay.current}
                isOpen={chartOpen}
                onClose={hideChart}
            />
        </>
    );
}
