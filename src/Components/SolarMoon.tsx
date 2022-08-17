import { Widget } from './SimpleComponents'
import {Tornadic} from '../svgs/svgs'

const SolarMoon = (props: {
    sunset: string,
    sunrise: string
}) => (
    <Widget id="solar-moon">
        <div>
            <p>Sunset</p>
            <h1>{props.sunset}</h1>
            <p>Sunrise</p>
            <h1>{props.sunrise}</h1>
        </div>
        <div>
            <Tornadic />
            <p>New Moon</p>
        </div>
    </Widget>
)

export default SolarMoon;