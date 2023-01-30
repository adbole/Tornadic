import { ReactNode } from 'react';
import { Widget, WidgetSize } from './SimpleComponents';
import { Normalize } from '../ts/Helpers';
import { useWeather } from './WeatherContext';
import { Calendar } from '../svgs/widget/widget.svgs';

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
);

const Daily = () => {
    const dailyData = useWeather().forecast.daily;

    //Determine the weeks low and high
    let low_week = dailyData.temperature_2m_min[0];
    let high_week = dailyData.temperature_2m_max[0];

    for(let i = 1; i < dailyData.time.length; ++i) {
        if(dailyData.temperature_2m_min[i] < low_week) {
            low_week = dailyData.temperature_2m_min[i];
        }

        if(dailyData.temperature_2m_max[i] > high_week) {
            high_week = dailyData.temperature_2m_max[i];
        }
    }

    function CalculateDualRangeCoverStyle(min: number, max: number) {
        const ToHSL = (x: number) => `hsl(${240 * ((100-x)/100)}deg, 100%, 50%)`;
        
        return {
            left: Normalize.Percent(min, low_week, high_week) + "%",
            right: Math.max(0, 100 - Normalize.Percent(max, low_week, high_week)) + "%",
            backgroundImage: `linear-gradient(90deg, ${ToHSL(min)} 0%, ${ToHSL(max)} 100%)`
        };
    }

    return (
        <Widget id="daily" size={WidgetSize.LARGE} widgetTitle="7-Day Forecast" widgetIcon={<Calendar/>}>
            <table>
                <tbody>
                    {
                        Array.from(useWeather().GetDailyValues()).map((day, index) => {
                            return <Day key={index} day={day.day} statusIcon = {day.condition.icon} chanceOfPrecip={0} low={day.temperature_low} high={day.temperature_high} style={CalculateDualRangeCoverStyle(day.temperature_low, day.temperature_high)}/>;
                        })
                    }
                </tbody>
            </table>
        </Widget>
    );
};

export default Daily;