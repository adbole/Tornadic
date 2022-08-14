import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

// #region Widget
export const Widget = forwardRef((props, ref) => {
    const {className, children, large, ...excess} = props;

    let defaultClass = "widget "
    if(large) defaultClass += "widget-large "

    return (
        <div className={defaultClass + className} ref={ref} {...excess} >
            {children}
        </div>
    )
});

Widget.defaultProps = { className: '' }
Widget.propTypes = { large: PropTypes.bool }
// #endregion Widget

// #region OrderedFlexList
export const OrderedFlexList = (props) => (
    <ol className={"flex-list flex-list-" + props.type}>
        {props.children}
    </ol>
)

OrderedFlexList.propTypes = {
    type: PropTypes.oneOf(['row', 'column']).isRequired
}
// #endregion OrderedFlexList

// #region Alert
export const Alert = (props) => (
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
// #endregion Alert

// #region BasicInfoView
export const SimpleInfoWidget = (props) => (
    <Widget className="basic-info">
        {props.icon}
        <p>{props.title}</p>
        <p>{props.value}</p>
    </Widget>
)

SimpleInfoWidget.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
}
// #endregion BasicInfoView
