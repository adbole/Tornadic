import React, { useRef } from 'react'

import { Tornadic } from '../svgs/svgs'
import { Widget } from "./SimpleComponents";

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

const DaySeperator = (props: { day: Days }) => (
    <li className="seperator">
        <p>{props.day}</p>
    </li>
)

enum Days {
    MON = "Mon",
    TUE = "Tue",
    WED = "Wed",
    THUR = "Thur",
    FRI = "Fri",
    SAT = "Sat", 
    SUN = "Sun"
}

function GenerateHours() {
    let hours = []

    for(let i = 1; i < 25; ++i) {
        if(i === 10) {
            hours.push(<DaySeperator key={i} day={Days.TUE}/>)
        }
        else {
            hours.push(<Hour key={i} statusIcon={<Tornadic />} time={i + " AM"} temp={95}/>)
        }
    }

    return hours
}



const Hourly = (props : {
    message?: string
}) => {
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
        <Widget id="hourly">
            {props.message != null && <p>{props.message}</p>}
            <ol className="flex-list flex-list-row drag-scroll" onMouseDown={MouseDown} onMouseLeave={MouseLeave} onMouseUp={MouseUp} onMouseMove={MouseMove}>
                {GenerateHours()}
            </ol>
        </Widget>
    )
}

export default Hourly;