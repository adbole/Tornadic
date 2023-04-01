import React from 'react';
import { useWeather } from './Contexes/WeatherContext';
import { HourInfo, WeatherData } from '../ts/WeatherData';

import { Widget } from "./SimpleComponents";
import { Clock } from '../svgs/widget/widget.svgs';

/**
 * A helper component for the Hourly component to display the individual hours
 */
const Hour = ({hourInfo} : {hourInfo: HourInfo}) => (
    <li>
        <p>{new Date(hourInfo.time).toLocaleTimeString("en-us", {hour: "numeric", hour12: true})}</p>
        <div>
            {hourInfo.conditionInfo.icon}
            {WeatherData.IsRaining(hourInfo) && <span>{hourInfo.precipitation_probability}%</span>}
        </div>
        <p>{hourInfo.temperature}°</p>
    </li>
);

/**
 * A helper component for the Hourly component to display a seperator to indicate when a new day starts.
 */
const DaySeperator = ({day}: { day: string }) => (
    <li className="seperator">
        <p>{day}</p>
    </li>
);

/**
 * Displays the next 48hrs of weather data in a horizontally-scrollable list
 * @returns The Hourly widget
 */
const Hourly = () => {
    const weatherData = useWeather();

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    function SetIsDown(value: boolean, list: HTMLOListElement) {
        isDown = value;
        
        if(isDown)
            list.classList.add('active');
        else
            list.classList.remove('active');
    }

    function MouseDown(e: React.MouseEvent<HTMLOListElement>) {
        SetIsDown(true, e.currentTarget);
        startX = e.pageX;

        scrollLeft = e.currentTarget.scrollLeft;
    }

    function MouseLeave(e: React.MouseEvent<HTMLOListElement>) { SetIsDown(false, e.currentTarget); }
    function MouseUp(e: React.MouseEvent<HTMLOListElement>) { SetIsDown(false, e.currentTarget); }

    function MouseMove(e: React.MouseEvent<HTMLOListElement>) {
        if(!isDown) return;
        e.preventDefault();

        const x = e.pageX;
        const change = (x - startX);
        e.currentTarget.scrollLeft = scrollLeft - change;
    }

    return (
        <Widget id="hourly" widgetTitle="Hourly Forecast" widgetIcon={<Clock/>}>
            <ol className="flex-list drag-scroll" onMouseDown={MouseDown} onMouseLeave={MouseLeave} onMouseUp={MouseUp} onMouseMove={MouseMove}>
                {
                    Array.from(weatherData.GetFutureValues()).map((forecast, index) => {
                        const time = new Date(forecast.time);

                        //To indicate a new day, add a day seperator
                        if(time.getHours() === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <DaySeperator day={time.toLocaleDateString("en-US", {weekday: "short"})}/>
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