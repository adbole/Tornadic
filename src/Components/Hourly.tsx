import React from 'react'
import { useWeather } from './WeatherContext';

import { Widget, WidgetSize } from "./SimpleComponents";
import { WeatherHelper } from '../ts/WeatherHelper';

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
)

const DaySeperator = (props: { day: string }) => (
    <li className="seperator">
        <p>{props.day}</p>
    </li>
)

enum Days {
    Sun = 0,
    Mon = 1,
    Tue = 2,
    Wed = 3,
    Thur = 4,
    Fri = 5,
    Sat = 6
}

// function GenerateHours() {
//     let hours = []

//     for(let i = 1; i < 25; ++i) {
//         if(i === 10) {
//             hours.push(<DaySeperator key={i} day={Days.Tue}/>)
//         }
//         else {
//             hours.push(<Hour key={i} statusIcon={<Tornadic />} time={i + " AM"} temp={95}/>)
//         }
//     }

//     return hours
// }



const Hourly = () => {
    const forecastData = useWeather()!.forecast;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    function SetIsDown(value: boolean, list: HTMLOListElement) {
        isDown = value;
        
        if(isDown)
            list.classList.add('active')
        else
            list.classList.remove('active');
    }

    function MouseDown(e: React.MouseEvent<HTMLOListElement>) {
        SetIsDown(true, e.currentTarget)
        startX = e.pageX;

        scrollLeft = e.currentTarget.scrollLeft;
    }

    function MouseLeave(e: React.MouseEvent<HTMLOListElement>) { SetIsDown(false, e.currentTarget) }
    function MouseUp(e: React.MouseEvent<HTMLOListElement>) { SetIsDown(false, e.currentTarget) }

    function MouseMove(e: React.MouseEvent<HTMLOListElement>) {
        if(!isDown) return;
        e.preventDefault();

        const x = e.pageX;
        const change = (x - startX);
        e.currentTarget.scrollLeft = scrollLeft - change;
    }

    return (
        <Widget id="hourly" size={WidgetSize.WIDE_FULL} widgetTitle="Hourly Forecast" widgetIcon={WeatherHelper.GetWeatherCondition(forecastData.current_weather.weathercode).icon}>
            {/* {props.message != null && <p>{props.message}</p>} */}
            <ol className="flex-list drag-scroll" onMouseDown={MouseDown} onMouseLeave={MouseLeave} onMouseUp={MouseUp} onMouseMove={MouseMove}>
                {
                    Array.from(WeatherHelper.GetFutureValues(forecastData)).map((forecast, index) => {
                        const time = new Date(forecast.time);

                        const hour = time.getHours() % 12;
                        const AMPM = time.getHours() >= 12 ? "PM" : "AM";

                        if(time.getHours() === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <DaySeperator day={Days[time.getDay()]}/>
                                    <Hour statusIcon={forecast.condition.icon} time={"12 " + AMPM} temp={forecast.temperature}/>
                                </React.Fragment>
                            )
                        }
                        else {
                            return (
                                <Hour key={index} statusIcon={forecast.condition.icon} time={(hour === 0 ? 12 : hour) + " " + AMPM} temp={forecast.temperature}/>
                            )
                        }
                    })
                }
            </ol>
        </Widget>
    )
}

export default Hourly;