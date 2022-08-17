import React from 'react';

// #region Widget
export const Widget = React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const {className, children, large, ...excess} = props;

    let classList = "widget "
    if(large) classList += "widget-large"
    if(className) classList += " " + className

    return (
        <div className={classList} ref={ref} {...excess} >
            {children}
        </div>
    )
});

type WidgetProps = {
    large?: boolean,
    children: React.ReactNode,
}

Widget.defaultProps = {
    large: false
}

// // #endregion Widget

// // #region OrderedFlexList
export enum FlexDirections { ROW = "row", COLUMN = "column" }
export const OrderedFlexList = (props: {
    type: FlexDirections,
    children: React.ReactNode
}) => (
    <ol className={"flex-list flex-list-" + props.type}>
        {props.children}
    </ol>
)
// // #endregion OrderedFlexList

// #region Alert
export const Alert = (props: {
    type: AlertTypes,
    name: string,
    message: string,
    moreExist?: boolean
}) => (
    <Widget className={"alert " + props.type}>
        <h2>{props.name}</h2>
        <p>{props.message}</p>
    </Widget>
)

export enum AlertTypes {
    WARNING = "warning",
    WATCH = "watch", 
    ADVISORY = "advisory",
    SPECIAL = "special"
}

Alert.defaultProps = {
    moreExist: false
}

// #endregion Alert

// #region BasicInfoView
export const SimpleInfoWidget = (props: {
    icon: React.ReactNode,
    title: string,
    value: string
}) => (
    <Widget className="basic-info">
        {props.icon}
        <p>{props.title}</p>
        <p>{props.value}</p>
    </Widget>
)
// #endregion BasicInfoView
