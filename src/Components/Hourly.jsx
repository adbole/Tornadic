import PropTypes from 'prop-types'
import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'
import { OrderedFlexList, Widget } from "./SimpleComponents";

const Hour = (props) => (
    <li>
        <p>{props.time}</p>
        {props.statusIcon}
        <p>{props.temp}°</p>
    </li>
)

Hour.propTypes = {
    time: PropTypes.string.isRequired,
    statusIcon: PropTypes.element.isRequired,
    temp: PropTypes.number.isRequired
}

const DaySeperator = (props) => (
    <li className="seperator">
        <p>{props.day}</p>
    </li>
)
DaySeperator.propTypes = { day: PropTypes.oneOf(['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']).isRequired }

function GenerateHours() {
    let hours = []

    for(let i = 1; i < 25; ++i) {
        if(i === 10) {
            hours.push(<DaySeperator key={i} day="Tue"/>)
        }
        else {
            hours.push(<Hour key={i} statusIcon={<Tornadic />} time={i + " AM"} status='' temp={95}/>)
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