import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import { Widget } from "Components/SimpleComponents";
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

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    function SetIsDown(value: boolean, list: HTMLOListElement) {
        isDown = value;
        
        list.classList.toggle("active", isDown);
    }

    function mouseDown(e: React.MouseEvent<HTMLOListElement>) {
        SetIsDown(true, e.currentTarget);
        startX = e.pageX;

        scrollLeft = e.currentTarget.scrollLeft;
    }

    function mouseMove(e: React.MouseEvent<HTMLOListElement>) {
        if(!isDown) return;
        e.preventDefault();
        
        const x = e.pageX;
        const change = (x - startX);
        e.currentTarget.scrollLeft = scrollLeft - change;
    }
    
    function mouseExit(e: React.MouseEvent<HTMLOListElement>) { SetIsDown(false, e.currentTarget); }

    return (
        <Widget id="hourly" widgetTitle="Hourly Forecast" widgetIcon={<Clock/>}>
            <ol className="flex-list drag-scroll" onMouseDown={mouseDown} onMouseLeave={mouseExit} onMouseUp={mouseExit} onMouseMove={mouseMove}>
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