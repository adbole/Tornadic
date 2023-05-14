import { TimeConverter } from '../../ts/Helpers';
import { AlertType, WeatherData } from '../../ts/WeatherData';
import { NWSAlert } from '../Contexes/WeatherContext';
import { Widget, WidgetSize } from '../SimpleComponents';

export const ConvertTime = (a: string) => TimeConverter.GetTimeFormatted(a, TimeConverter.TimeFormat.DateTime);

export function ToAlertCSS(alert: AlertType) {
    switch(alert) {
        case AlertType.WARNING:
            return "alert-warning";
        case AlertType.WATCH:
            return "alert-watch";
        case AlertType.ADVISORY:
            return "alert-advisory";
        default:
            return "alert-none";
    }
}

export const AlertDisplay = (props: {alert: NWSAlert} & React.HTMLAttributes<HTMLDivElement>) => {
    const {alert, ...excess} = props;

    return (
        <Widget size={WidgetSize.WIDE} className={ToAlertCSS(WeatherData.GetAlertType(alert))} {...excess}>
            <h2>{alert.properties.event}</h2>
            <p>{alert.properties.event} until {ConvertTime(alert.properties.ends ?? alert.properties.expires)}</p>
        </Widget>
    );
};