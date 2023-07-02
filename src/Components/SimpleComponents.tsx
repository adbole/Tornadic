/**
 * A collection of simple components that aren't complex enough for their own files
 */

import React from "react";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";
import { Forecast } from "Contexts/WeatherContext/index.types";

import Chart, { ChartViews } from "Components/Chart";
import HazardLevel, { HazardType } from "Components/HazardLevel";
import * as WidgetIcons from "svgs/widget";

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
type ChartViewKey = keyof typeof ChartViews;

export const SimpleInfoWidget = ({ icon, title, property }: {
    icon: React.ReactNode,
    title: string,
    property: keyof Omit<Forecast["hourly"], "time">
}) => {
    const { weather } = useWeather();
    const { showModal } = useModal();

    const chartView = ChartViews[Object.keys(ChartViews).find((k) => ChartViews[k as ChartViewKey] === property) as ChartViewKey];

    return (
        <Widget className="basic-info" isTemplate onClick={() => showModal(<Chart showView={chartView}/>)}>
            {icon}
            <h1 className='widget-title'>{title}</h1>
            <p>{weather.getForecast(property).toFixed(0) + weather.getForecastUnit(property)}</p>
        </Widget>
    );
};
// #endregion SimpleInfoWidget

export const DayValues = () => {
    return (
        <>
            <SimpleInfoWidget icon={<WidgetIcons.Droplet />} title="Precipitation" property={"precipitation"}/>
            <SimpleInfoWidget icon={<WidgetIcons.Thermometer />} title="Dewpoint" property={"dewpoint_2m"}/>
            <SimpleInfoWidget icon={<WidgetIcons.Moisture />} title="Humidity" property={"relativehumidity_2m"}/>
            <SimpleInfoWidget icon={<WidgetIcons.Eye />} title="Visibility" property={"visibility"}/>
        </>
    );
};

export const AirUV = () => {
    const { weather } = useWeather();
    
    const AQ = Math.round(weather.getForecast("us_aqi"));
    const UV = Math.round(weather.getForecast("uv_index"));

    return (
        <>
            <HazardLevel hazard={HazardType.AirQuality} hazardValue={AQ} />
            <HazardLevel hazard={HazardType.UV} hazardValue={UV} />
        </>
    );
};