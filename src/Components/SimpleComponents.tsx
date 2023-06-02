/**
 * A collection of simple components that aren't complex enough for their own files
 */

import React from 'react';
import { TornadicLoader } from 'svgs/icon';
import * as WidgetIcons from 'svgs/widget';

import HazardLevelView from './HazardLevelView';

import { Forecast, useWeather } from './Contexts/Weather';
import { WeatherData } from './Contexts/Weather/WeatherData';

import { useModal } from './Contexts/ModalContext';
import Chart, { HourlyProperties } from './Chart';

// #region Widget
export enum WidgetSize {
    NORMAL = "",
    LARGE = " widget-large",
    WIDE =  " widget-wide"
}

/**
 * The base of all widgets in the Tornadic application. Everything is a widget and it all starts here.
 * This component will display a simple rectangle box in the root's grid, but can be expanded and customized to fit any need. 
 */
export const Widget = React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const {className, children, size, widgetTitle, widgetIcon, isTemplate, ...excess} = props;

    let classList = "widget" + size;
    if(isTemplate) classList += " template"
    if(className) classList += " " + className;

    return (
        <section className={classList} ref={ref} {...excess}>
            {widgetTitle && widgetIcon && <h1 className="widget-title">{widgetIcon} {widgetTitle}</h1>}
            {children}
        </section>
    );
});

type WidgetProps = {
    size?: WidgetSize,
    children: React.ReactNode,
    widgetTitle?: string,
    widgetIcon?: React.ReactNode,
    //Normal Widgets have a style rule that causes all child elements (excluding the title) to get flex: 1
    //so they take up as much space as possible. This flag will determine if the template class is added to prevent it
    isTemplate?: boolean 
}

Widget.defaultProps = {
    size: WidgetSize.NORMAL
};
// #endregion Widget

// #region SimpleInfoWidget
type HourlyKey = keyof typeof HourlyProperties;

export const SimpleInfoWidget = ({icon, title, property}: {
    icon: React.ReactNode,
    title: string,
    property: keyof Omit<Forecast["hourly"], "time">
}) => {
    const forecastData = useWeather().forecast;
    const {showModal} = useModal();

    return (
        //Because HourlyProperties' values map to a Forecast property, then a property of Forecast can be mapped to a key of HourlyProperties (if it exists on HourlyProperties)
        <Widget className="basic-info" isTemplate onClick={() => showModal(<Chart showProperty={HourlyProperties[Object.keys(HourlyProperties).filter((k) => HourlyProperties[k as HourlyKey] === property)[0] as HourlyKey]}/>)}>
            {icon}
            <h1 className='widget-title'>{title}</h1>
            <p>{forecastData.hourly[property][forecastData.nowIndex].toFixed(0) + forecastData.hourly_units[property]}</p>
        </Widget>
    );
};
// #endregion SimpleInfoWidget

export const Loader = () => (
    <>
        <div id="message-screen">
            <TornadicLoader/>
        </div>
    </>
);

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
    const forecastData = useWeather().forecast;
    const airqualityData = useWeather().airQuality.hourly;

    const AQ = Math.round(airqualityData.us_aqi[forecastData.nowIndex]);
    const UV = Math.round(airqualityData.uv_index[forecastData.nowIndex]);

    return (
        <>
            <HazardLevelView info={WeatherData.GetAQInfo(AQ)} />
            <HazardLevelView info={WeatherData.GetUVInfo(UV)} />
        </>
    );
};