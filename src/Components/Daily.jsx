import React from 'react';
import PropTypes from 'prop-types'
import { OrderedFlexList, Widget } from './SimpleComponents';
import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'
import Normalize from '../js/Normalize';

const Day = (props) =>(
    <tr>
        <td><p>{props.day}</p></td>
        <td>        
            {props.statusIcon}
            {props.chanceOfPrecip > 0 && <span>{props.chanceOfPrecip}%</span>}
        </td>
        <td>
            <div className='temp-range'>
                <p>{props.low}°</p>    
                <div className="dual-range">
                    <div className="covered" style={props.style}></div>
                </div>
                <p>{props.high}°</p>
            </div>
        </td>
    </tr>
)

Day.propTypes = {
    day: PropTypes.string.isRequired,
    statusIcon: PropTypes.element.isRequired,
    chanceOfPrecip: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
}

const days = ['Now', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun', 'Mon']
let count = 0;

const Daily = (props) => {
    function  CalculateDualRangeCoverStyle(min, max) {
        const ToHSL = (x) => `hsl(${240 * ((100-x)/100)}deg, 100%, 50%)`
        
        return {
            left: Normalize.Percent(min, props.globalLow, props.globalHigh) + "%",
            right: 100 - Normalize.Percent(max, props.globalLow, props.globalHigh) + "%",
            backgroundImage: `linear-gradient(90deg, ${ToHSL(min)} 0%, ${ToHSL(max)} 100%)`
        }
    }

    return (
        <Widget id="daily" large>
            <table>
                <tbody>
                    {
                        days.map(day => {
                            function generateRandomIntegerInRange(min, max) {
                                return Math.floor(Math.random() * (max - min + 1)) + min;
                            }
        
                            let low = generateRandomIntegerInRange(80, 90);
                            let high = generateRandomIntegerInRange(90, 100);
        
                            if(Math.random() >= 0.5) {
                                return <Day key={count++} day={day} statusIcon={<Tornadic />} chanceOfPrecip={0} low={low} high={high} style={CalculateDualRangeCoverStyle(low, high)}/>
                            }
                            else {
                                return <Day key={count++} day={day} statusIcon={<Tornadic />} chanceOfPrecip={20} low={low} high={high} style={CalculateDualRangeCoverStyle(low, high)}/>
                            }
                            
                        })
                    }
                </tbody>
            </table>
        </Widget>
    )
}

Daily.propTypes = {
    globalLow: PropTypes.number.isRequired,
    globalHigh: PropTypes.number.isRequired
}

export default Daily