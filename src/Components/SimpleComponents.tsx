import React from 'react';

// #region Widget
export enum WidgetSize {
    NORMAL = "",
    LARGE = " widget-large",
    WIDE = " widget-wide",
    WIDE_FULL = " widget-wide-full"
}

export const Widget = React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const {className, children, size, widgetTitle, widgetIcon, ...excess} = props;

    let classList = "widget" + size
    if(className) classList += " " + className

    return (
        <div className={classList} ref={ref} {...excess} >
            {widgetTitle && widgetIcon && 
                <div className="widget-title">
                    <p>{widgetIcon} {widgetTitle} </p>
                </div>
            }
            
            {children}
    </div>
    )
});

type WidgetProps = {
    size?: WidgetSize,
    children: React.ReactNode,
    widgetTitle?: string,
    widgetIcon?: React.ReactNode
}

Widget.defaultProps = {
    size: WidgetSize.NORMAL
}
// #endregion Widget

// #region Alert
// export const Alert = (props: {
//     type: AlertTypes,
//     name: string,
//     message: string,
//     moreExist?: boolean
// }) => (
//     <Widget className={"alert " + props.type}>
//         <h2>{props.name}</h2>
//         <p>{props.message}</p>
//     </Widget>
// )

// export enum AlertTypes {
//     WARNING = "warning",
//     WATCH = "watch", 
//     ADVISORY = "advisory",
//     SPECIAL = "special"
// }

// Alert.defaultProps = {
//     moreExist: false
// }

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
