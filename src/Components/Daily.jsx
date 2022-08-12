import React from 'react';
import PropTypes from 'prop-types'
import { OrderedFlexList, Widget } from './BaseComponents';
import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'

const Day = (props) =>(
    <li>
        <p>{props.day}</p>
        <div className="status">
            {props.statusIcon}
            {props.chanceOfPrecip > 0 && <p>{props.chanceOfPrecip}%</p>}
        </div>

        <div className="temp-range">
            <p>{props.low}</p>    
            <div className="dual-range">
                <div className="covered" style={props.style}></div>
            </div>
            <p>{props.high}</p>
        </div>
    </li>
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

export default class Daily extends React.Component {
    CalculateDualRangeCoverStyle(min, max) {
        const Calculate = (x, min, max) => (x - min)/(max-min) * 100;
        const ToHSL = (x) => `hsl(${240 * ((100-x)/100)}deg, 100%, 50%)`
        
        return {
            left: Calculate(min, this.props.globalLow, this.props.globalHigh) + "%",
            right: 100 - Calculate(max, this.props.globalLow, this.props.globalHigh) + "%",
            backgroundImage: `linear-gradient(90deg, ${ToHSL(min)} 0%, ${ToHSL(max)} 100%)`
        }
    }

    render() {
        return (
            <Widget id="daily" large={true}>
                <OrderedFlexList type="column">
                    {
                        days.map(day => {
                            function generateRandomIntegerInRange(min, max) {
                                return Math.floor(Math.random() * (max - min + 1)) + min;
                            }
        
                            let low = generateRandomIntegerInRange(80, 90);
                            let high = generateRandomIntegerInRange(90, 100);
        
                            if(Math.random() >= 0.5) {
                                return <Day key={count++} day={day} statusIcon={<Tornadic />} chanceOfPrecip={0} low={low} high={high} style={this.CalculateDualRangeCoverStyle(low, high)}/>
                            }
                            else {
                                return <Day key={count++} day={day} statusIcon={<Tornadic />} chanceOfPrecip={20} low={low} high={high} style={this.CalculateDualRangeCoverStyle(low, high)}/>
                            }
                            
                        })
                    }
                </OrderedFlexList>
            </Widget>
        )
    }
}

Daily.propTypes = {
    globalLow: PropTypes.number.isRequired,
    globalHigh: PropTypes.number.isRequired
}