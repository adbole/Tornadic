import React from 'react'
import { useNWS } from './NWSContext';

import { Tornadic } from '../svgs/svgs'
import { Widget } from "./SimpleComponents";
import NWSValueSearcher from '../ts/NWSValueSearcher';

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



const Hourly = (props: {message: string}) => {
    const nws = useNWS();

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
                {
                    Array.from(NWSValueSearcher.GetFutureValues(nws!.properties.temperature)).map(temp => {
                        const hour = temp.validTime.getHours() % 12;
                        const AMPM = temp.validTime.getHours() >= 12 ? "PM" : "AM";

                        if(temp.validTime.getHours() === 0) {
                            return (
                                <>
                                    <DaySeperator key={temp.validTime.getTime()} day={Days[temp.validTime.getDay()]}/>
                                    <Hour key={temp.validTime.getTime()} statusIcon={<Tornadic />} time={"12 " + AMPM} temp={temp.value}/>
                                </>
                            )
                        }
                        else {
                            return (
                                <Hour key={temp.validTime.getTime()} statusIcon={<Tornadic />} time={(hour === 0 ? 12 : hour) + " " + AMPM} temp={temp.value}/>
                            )
                        }
                    })
                }
            </ol>
        </Widget>
    )
}

export default Hourly;