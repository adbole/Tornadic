import React from "react";

import { useBooleanState, useDragScroll } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import Widget from "Components/Widget";
import { Clock } from "svgs/widget";

import getTimeFormatted from "ts/TimeConversion";
import type { HourInfo } from "ts/Weather";

/**
 * A helper component for the Hourly component to display the individual hours
 */
function Hour({ hourInfo }: { hourInfo: HourInfo }) {
    return (
        <li>
            <p>{getTimeFormatted(hourInfo.time, "hour")}</p>
            <div>
                <hourInfo.conditionInfo.icon />
                {hourInfo.has_chance_of_rain && <span>{hourInfo.precipitation_probability}%</span>}
            </div>
            <p>{hourInfo.temperature}°</p>
        </li>
    );
}

/**
 * A helper component for the Hourly component to display a seperator to indicate when a new day starts.
 */
function DaySeperator({ day }: { day: string }) {
    return (
        <li className="seperator">
            <p>{day}</p>
        </li>
    );
}

/**
 * Displays the next 48hrs of weather data in a horizontally-scrollable list
 * @returns The Hourly widget
 */
export default function Hourly() {
    const { weather } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);
    const listRef = React.useRef<HTMLOListElement | null>(null);

    useDragScroll(listRef);

    return (
        <>
            <Widget
                className="hourly"
                widgetTitle="Hourly Forecast"
                widgetIcon={<Clock />}
                onClick={showModal}
            >
                <ol ref={listRef} className="flex-list drag-scroll">
                    {[...weather.getFutureValues()].map((forecast, index) => {
                        const time = new Date(forecast.time);

                        //To indicate a new day, add a day seperator
                        if (time.getHours() === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <DaySeperator day={getTimeFormatted(time, "weekday")} />
                                    <Hour hourInfo={forecast} />
                                </React.Fragment>
                            );
                        }
                        return <Hour key={index} hourInfo={forecast} />;
                    })}
                </ol>
            </Widget>
            <Chart showView="temperature_2m" isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
