import { ReactNode } from 'react';
import { Widget } from './SimpleComponents';
import { Tornadic } from '../svgs/svgs'
import Normalize from '../ts/Normalize';

const Day = (props: {
    day: string,
    statusIcon: ReactNode,
    chanceOfPrecip: number,
    low: number,
    high: number,
    style: React.CSSProperties
}) =>(
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

const days = ['Now', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun', 'Mon']
let count = 0;

const Daily = (props : {
    globalLow: number,
    globalHigh: number
}) => {
    function  CalculateDualRangeCoverStyle(min: number, max: number) {
        const ToHSL = (x: number) => `hsl(${240 * ((100-x)/100)}deg, 100%, 50%)`
        
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
                            function generateRandomIntegerInRange(min: number, max: number) {
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

export default Daily