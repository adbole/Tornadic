import PropTypes from 'prop-types'
import { Widget } from "./BaseComponents";

const Alert = (props) => (
    <Widget className={"alert " + props.type}>
        <h2>{props.name}</h2>
        <p>{props.message}</p>
    </Widget>
)
Alert.propTypes = {
    type: PropTypes.oneOf(['warning', 'watch', 'advisory', 'special']).isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    moreExist: PropTypes.bool
}

export default Alert;