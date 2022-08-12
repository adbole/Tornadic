import PropTypes from 'prop-types';

export const Widget = (props) => {
    let className = "widget "
    if(props.large) className += "widget-large "

    return (
        <div className={className + props.class} id={props.id}>
            {props.children}
        </div>
    )
}

Widget.proptTypes = {
    large: PropTypes.bool,
    class: PropTypes.string,
    id: PropTypes.string
}

export const OrderedFlexList = (props) => (
    <ol className={"flex-list flex-list-" + props.type}>
        {props.children}
    </ol>
)

OrderedFlexList.propTypes = {
    type: PropTypes.oneOf(['row', 'column']).isRequired
}

export const BasicInfoView = (props) => (
    <Widget>
        
    </Widget>
)