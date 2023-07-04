/**
 * A collection of simple components that aren't complex enough for their own files
 */

import React from "react";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart, { ChartViews } from "Components/Chart";

// #region Widget
export enum WidgetSize {
    NORMAL = "",
    LARGE = " widget-large",
    WIDE =  " widget-wide"
}

type WidgetProps = {
    size?: WidgetSize,
    children: React.ReactNode,
    widgetTitle?: string,
    widgetIcon?: React.ReactNode,
    //Normal Widgets have a style rule that causes all child elements (excluding the title) to get flex: 1
    //so they take up as much space as possible. This flag will determine if the template class is added to prevent it
    isTemplate?: boolean 
}

/**
 * The base of all widgets in the Tornadic application. Everything is a widget and it all starts here.
 * This component will display a simple rectangle box in the root's grid, but can be expanded and customized to fit any need. 
 */
export const Widget = React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const { className, children, size = WidgetSize.NORMAL, widgetTitle, widgetIcon, isTemplate, ...excess } = props;

    let classList = "widget" + size;
    if(isTemplate) classList += " template";
    if(className) classList += " " + className;

    return (
        <section className={classList} ref={ref} {...excess}>
            {widgetTitle && widgetIcon && <h1 className="widget-title">{widgetIcon} {widgetTitle}</h1>}
            {children}
        </section>
    );
});
// #endregion Widget

// #region SimpleInfoWidget

export const SimpleInfoWidget = ({ icon, title, property }: {
    icon: React.ReactNode,
    title: string,
    property: ChartViews
}) => {
    const { weather } = useWeather();
    const { showModal } = useModal();

    return (
        <Widget className="basic-info" isTemplate onClick={() => showModal(<Chart showView={property}/>)}>
            {icon}
            <h1 className='widget-title'>{title}</h1>
            <p>{weather.getForecast(property).toFixed(0) + weather.getForecastUnit(property)}</p>
        </Widget>
    );
};
// #endregion SimpleInfoWidget