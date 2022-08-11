import React from "react";
import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'

const Hour = ({ time, status, temp }) => (
    <li>
        <p>{time}</p>
        <Tornadic />
        <p>{temp}°</p>
    </li>
)

const DaySeperator = ({ day }) => (
    <li className="seperator">
        <p>{day}</p>
    </li>
)

function GenerateHours() {
    let hours = []

    for(let i = 1; i < 25; ++i) {
        if(i === 10) {
            hours.push(<DaySeperator key={i} day="Tue"/>)
        }
        else {
            hours.push(<Hour key={i} time={i + " AM"} status='' temp="95"/>)
        }
    }

    return hours
}

const Hourly = ({ message = null }) => (
    <div className="widget" id="hourly">
        {message != null && <p>{message}</p>}
        <ol>
            {GenerateHours()}
        </ol>
    </div>
)

export default Hourly;