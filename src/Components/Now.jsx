import PropTypes from 'prop-types'

const Now = (props) => (
    <div id="now">
        <p>{props.location}</p>

        <p id="current">{props.currentTemp}</p>

        <p>{props.status}</p>
        <p>Feels like <span>{props.feelsTemp}</span>°</p>
    </div>
)

Now.propTypes = {
    location: PropTypes.string.isRequired,
    currentTemp: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    feelsTemp: PropTypes.number.isRequired
}

export default Now;