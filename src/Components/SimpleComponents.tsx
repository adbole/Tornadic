import React from 'react';
import { TornadicLoader } from '../svgs/svgs';
import { WeatherData } from '../ts/WeatherData';
import { useAlert } from './Contexes/AlertContex';
import { useWeather } from './Contexes/WeatherContext';

// #region Widget
export enum WidgetSize {
    NORMAL = "",
    LARGE = " widget-large",
    WIDE = " widget-wide",
    WIDE_FULL = " widget-wide-full"
}

export const Widget = React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const {className, children, size, widgetTitle, widgetIcon, ...excess} = props;

    let classList = "widget" + size;
    if(className) classList += " " + className;

    return (
        <div className={classList} ref={ref} {...excess} >
            {widgetTitle && widgetIcon && 
                <div className="widget-title">
                    <p>{widgetIcon} {widgetTitle} </p>
                </div>
            }
            
            {children}
    </div>
    );
});

type WidgetProps = {
    size?: WidgetSize,
    children: React.ReactNode,
    widgetTitle?: string,
    widgetIcon?: React.ReactNode
}

Widget.defaultProps = {
    size: WidgetSize.NORMAL
};
// #endregion Widget

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
);
// #endregion BasicInfoView

export const Loader = () => (
    <>
        <div id="loader">
            <TornadicLoader/>
        </div>
    </>
);

export const Alert = () => {
    console.log("render");
    const alertData = useWeather().alerts;
    const alertModals = useAlert();

    //If no alerts are active then don't display this component.
    if(!alertData.length) return <></>;

    const currentAlert = alertData[0].properties;
    const alertColor = WeatherData.GetAlertType(alertData[0]);

    return (
        <Widget size={WidgetSize.WIDE} id="alert" className={alertColor} onClick={() => alertModals.showAlert(0)}>
            <h2>{currentAlert.event}</h2>
            <p>{currentAlert.event} until {new Date(currentAlert.ends).toLocaleTimeString("en-us", {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"})}</p>
        </Widget>
    );
};