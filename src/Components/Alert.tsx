import React from 'react';
import { WeatherData } from '../ts/WeatherData';
import { NWSAlert, useWeather } from './Contexes/WeatherContext';
import { Modal, useModal } from './Contexes/ModalContext';
import { Widget, WidgetSize } from './SimpleComponents';

const Alert = () => {
    const alertData = useWeather().alerts;
    const modals = useModal();

    //If no alerts are active then don't display this component.
    if(!alertData.length) return <></>;

    const currentAlert = alertData[0].properties;
    const alertColor = WeatherData.GetAlertType(alertData[0]);

    return (
        <Widget size={WidgetSize.WIDE} id="alert" className={alertColor} onClick={() => modals.showModal(<AlertModal alert={alertData[0]}/>)}>
            <h2>{currentAlert.event}</h2>
            <p>{currentAlert.event} until {new Date(currentAlert.ends).toLocaleTimeString("en-us", {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"})}</p>
        </Widget>
    );
};

export default Alert;

/**
 * Takes an ISO8601 string and converts it to a nice readable string in the format weekday, month, day, hour:minute AM/PM timezone
 * @param iso The ISO8601 string to convert
 * @returns The now nice readable string obtained from conversion
 */
function GetTimeString(iso: string) {
    return new Date(iso).toLocaleTimeString("en-us", {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"});
}

/**
 * Display the given NWSAlert as a modal to get more in depth information from.
 */
export const AlertModal = ({alert}: {alert: NWSAlert}) => {
    const alertData = alert.properties;
    const alertType = WeatherData.GetAlertType(alert);
    
    return (
        <Modal modalTitle={alertData.event} modalTitleClass={alertType}>
            <p><em>Issuing Office:</em> {alertData.senderName}</p>
            <p><em>Issued:</em> {GetTimeString(alertData.sent)}</p>
            <p><em>Effective:</em> {GetTimeString(alertData.effective)}</p>
            <p><em>Ends:</em> {GetTimeString(alertData.ends)}</p>
            <hr/>
            {
                alertData.description.split("*").map((string, index) => {
                    if(!string.length) return <React.Fragment key={index}/>;
        
                    return <p key={index}>* {string}</p>;
                })    
            }
            <hr/>
            <h3>Affected Areas</h3>
            <p>{alertData.areaDesc}</p>
            <h3>Instructions</h3>
            <p>{alertData.instruction}</p>
        </Modal>
    );
};