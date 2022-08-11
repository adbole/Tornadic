import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'

const Day = ({ day, status, chanceOfPrecip = 0, low, high, style }) =>(
    <li>
        <p>{day}</p>
        <div className="status">
            <Tornadic />
        </div>

        <div className="temp-range">
            <p>{low}</p>    
            <div className="dual-range">
                <div className="covered" style={style}></div>
            </div>
            <p>{high}</p>
        </div>
    </li>
)

function CalculateDualRangeCoverStyle(min, max, minBound, maxBound) {
    const Calculate = (x, min, max) => (x - min)/(max-min) * 100;
    
    return {
        left: Calculate(min, minBound, maxBound) + "%",
        right: 100 - Calculate(max, minBound, maxBound) + "%"
    }
}

const days = ['Now', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun', 'Mon']

const Daily = ({ globalLow, globalHigh }) => (
    <div className="widget widget-large" id="daily">
        <ol className="flex-list flex-list-column">
            {
                days.map(day => {
                    function generateRandomIntegerInRange(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }

                    let low = generateRandomIntegerInRange(80, 90);
                    let high = generateRandomIntegerInRange(90, 100);

                    if(Math.random() >= 0.5) {
                        return <Day day={day} status="Sunny" low={low} high={high} style={CalculateDualRangeCoverStyle(low, high, globalLow, globalHigh)}/>
                    }
                    else {
                        return <Day day={day} status="Sunny" chanceOfPrecip={20} low={low} high={high} style={CalculateDualRangeCoverStyle(low, high, globalLow, globalHigh)}/>
                    }
                    
                })
            }
        </ol>
    </div>
)

export default Daily;