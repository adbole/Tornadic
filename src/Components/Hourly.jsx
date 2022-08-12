import React from "react";
import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'
import { OrderedFlexList, Widget } from "./BaseComponents";

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
    <Widget id="hourly">
        {message != null && <p>{message}</p>}
        <OrderedFlexList type="row">
            {GenerateHours()}
        </OrderedFlexList>
    </Widget>
)

export default Hourly;