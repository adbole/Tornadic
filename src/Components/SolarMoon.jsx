import PropTypes from 'prop-types'
import { Widget } from './SimpleComponents'
import {ReactComponent as Tornadic} from '../svgs/Tornadic.svg'

const SolarMoon = (props) => (
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

SolarMoon.propTypes = {
    sunset: PropTypes.string.isRequired,
    sunrise: PropTypes.string.isRequired
}

export default SolarMoon;