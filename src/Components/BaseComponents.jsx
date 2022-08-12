import PropTypes from 'prop-types';

export const Widget = (props) => {
    const {className, children, large, ...excess} = props;

    let defaultClass = "widget "
    if(large) defaultClass += "widget-large "

    return (
        <div className={defaultClass + className} {...excess} >
            {children}
        </div>
    )
}

Widget.defaultProps = { className: '' }
Widget.propTypes = { large: PropTypes.bool }

export const OrderedFlexList = (props) => (
    <ol className={"flex-list flex-list-" + props.type}>
        {props.children}
    </ol>
)

OrderedFlexList.propTypes = {
    type: PropTypes.oneOf(['row', 'column']).isRequired
}

export const BasicInfoView = (props) => (
    <Widget className="basic-info">
        {props.icon}
        <p>{props.title}</p>
        <p>{props.value}</p>
    </Widget>
)

BasicInfoView.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
}