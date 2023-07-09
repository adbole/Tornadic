import React from "react";

import { useDragScroll } from "Hooks";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import Widget from "Components/Widget";
import { Clock } from "svgs/widget";

import * as TimeConversion from "ts/TimeConversion";
import { HourInfo } from "ts/Weather";

/**
 * A helper component for the Hourly component to display the individual hours
 */
const Hour = ({ hourInfo } : { hourInfo: HourInfo }) => (
    <li>
        <p>{TimeConversion.getTimeFormatted(hourInfo.time, TimeConversion.TimeFormat.Hour)}</p>
        <div>
            <hourInfo.conditionInfo.icon/>
            {hourInfo.has_chance_of_rain && <span>{hourInfo.precipitation_probability}%</span>}
        </div>
        <p>{hourInfo.temperature}°</p>
    </li>
);

/**
 * A helper component for the Hourly component to display a seperator to indicate when a new day starts.
 */
const DaySeperator = ({ day }: { day: string }) => (
    <li className="seperator">
        <p>{day}</p>
    </li>
);

/**
 * Displays the next 48hrs of weather data in a horizontally-scrollable list
 * @returns The Hourly widget
 */
const Hourly = () => {
    const { weather } = useWeather();
    const { showModal } = useModal();
    const listRef = React.useRef<HTMLOListElement | null>(null);

    useDragScroll(listRef);

    return (
        <Widget id="hourly" widgetTitle="Hourly Forecast" widgetIcon={<Clock/>} onClick={() => showModal(<Chart showView="temperature_2m"/>)}>
            <ol ref={listRef} className="flex-list drag-scroll">
                {
                    Array.from(weather.getFutureValues()).map((forecast, index) => {
                        const time = new Date(forecast.time);

                        //To indicate a new day, add a day seperator
                        if(time.getHours() === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <DaySeperator day={TimeConversion.getTimeFormatted(time, TimeConversion.TimeFormat.Weekday)}/>
                                    <Hour hourInfo={forecast}/>
                                </React.Fragment>
                            );
                        }
                        else {
                            return (
                                <Hour key={index} hourInfo={forecast}/>
                            );
                        }
                    })
                }
            </ol>
        </Widget>
    );
};

export default Hourly;