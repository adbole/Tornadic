import React from 'react';
import { useWeather } from './Contexes/WeatherContext';
import { WeatherData } from '../ts/WeatherData';

import { Widget, WidgetSize } from "./SimpleComponents";

/**
 * A helper component for the Hourly component to display the individual hours
 */
const Hour = (props : {
    time: string,
    statusIcon: React.ReactNode,
    temp: number
}) => (
    <li>
        <p>{props.time}</p>
        {props.statusIcon}
        <p>{props.temp}°</p>
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
        <Widget id="hourly" size={WidgetSize.WIDE_FULL} widgetTitle="Hourly Forecast" widgetIcon={WeatherData.GetWeatherCondition(weatherData.forecast.current_weather.weathercode).icon}>
            {/* {props.message != null && <p>{props.message}</p>} */}
            <ol className="flex-list drag-scroll" onMouseDown={MouseDown} onMouseLeave={MouseLeave} onMouseUp={MouseUp} onMouseMove={MouseMove}>
                {
                    Array.from(weatherData.GetFutureValues()).map((forecast, index) => {
                        const time = new Date(forecast.time);

                        const hour = time.getHours() % 12;
                        const AMPM = time.getHours() >= 12 ? "PM" : "AM";

                        if(time.getHours() === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <DaySeperator day={time.toLocaleDateString("en-US", {weekday: "short", timeZone: "UTC"})}/>
                                    <Hour statusIcon={forecast.condition.icon} time={"12 " + AMPM} temp={forecast.temperature}/>
                                </React.Fragment>
                            );
                        }
                        else {
                            return (
                                <Hour key={index} statusIcon={forecast.condition.icon} time={(hour === 0 ? 12 : hour) + " " + AMPM} temp={forecast.temperature}/>
                            );
                        }
                    })
                }
            </ol>
        </Widget>
    );
};

export default Hourly;