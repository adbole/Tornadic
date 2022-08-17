import { Tornadic } from '../svgs/svgs'
import { OrderedFlexList, FlexDirections, Widget } from "./SimpleComponents";

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
}) => (
    <Widget id="hourly">
        {props.message != null && <p>{props.message}</p>}
        <OrderedFlexList type={FlexDirections.ROW}>
            {GenerateHours()}
        </OrderedFlexList>
    </Widget>
)

export default Hourly;