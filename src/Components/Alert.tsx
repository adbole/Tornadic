import React from 'react';
import { AlertType, WeatherData } from '../ts/WeatherData';
import { NWSAlert, useWeather } from './Contexes/WeatherContext';
import { Modal, useModal } from './Contexes/ModalContext';
import { Widget, WidgetSize } from './SimpleComponents';

/**
 * Takes an ISO8601 string and converts it to a nice readable string in the format weekday, month, day, hour:minute AM/PM timezone
 * @param iso The ISO8601 string to convert
 * @returns The now nice readable string obtained from conversion
 */
function GetTimeString(iso: string) {
    return new Date(iso).toLocaleTimeString("en-us", {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"});
}

function ToAlertCSS(alert: AlertType) {
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

const AlertDisplay = ({alertData, className, onClick} : {alertData: NWSAlert, className: string, onClick: React.MouseEventHandler<HTMLDivElement>}) => (
    <Widget size={WidgetSize.WIDE} id="alert" className={className} onClick={onClick}>
        <h2>{alertData.properties.event}</h2>
        <p>{alertData.properties.event} until {GetTimeString(alertData.properties.ends ?? alertData.properties.expires)}</p>
    </Widget>
);

const Alert = () => {
    const alertData = useWeather().alerts;
    const modals = useModal();

    //If no alerts are active then don't display this component.
    if(!alertData.length) return <></>;

    //Determine which alert should be shown. Warnings get highest priority with the lastest being first. 
    let alertToShow = alertData[0];
    let highestAlertType = WeatherData.GetAlertType(alertData[0]);
    let newestAge = new Date(alertData[0].properties.sent);

    for(let i = 1; i < alertData.length; ++i) {
        const ithType = WeatherData.GetAlertType(alertData[i]);
        const sentDate = new Date(alertData[i].properties.sent);

        //Replace the alertToShow if its severity is lower
        if(highestAlertType < ithType) {
            alertToShow = alertData[i];
            highestAlertType = ithType;
            newestAge = sentDate;
        }
        //When two alerts are the same severity, we want the youngest one
        else if(highestAlertType === ithType && sentDate > newestAge) {
            alertToShow = alertData[i];
            highestAlertType = ithType;
            newestAge = sentDate;
        }
    }

    const onClickHandler = () => modals.showModal(alertData.length > 1 ? <AlertSelectionModal alertData={alertData}/> : <AlertModal alert={alertData[0]}/>);

    return <AlertDisplay alertData={alertToShow} className={ToAlertCSS(highestAlertType)} onClick={onClickHandler}/>;
};

export default Alert;

const AlertSelectionModal = ({alertData}: {alertData: NWSAlert[]}) => {
    const modals = useModal();

    //Memoize the component to prevent unnecessary operations
    const memoizedComponent = React.useMemo(() => (
        <Modal modalTitle={alertData.length + " Weather Alerts"} modalTitleClass={"alert-none"} id="alert-list-modal">
            {
                alertData.map((alert, key) => {
                    //Inclues override to onClose to reopen the alert selection modal
                    const onClickHandler = () => modals.showModal(<AlertModal alert={alert} onClose={() => modals.showModal(memoizedComponent)}/>);

                    return <AlertDisplay key={key} alertData={alert} className={ToAlertCSS(WeatherData.GetAlertType(alert))} onClick={onClickHandler}/>;
                })
            }
        </Modal>
    ), [alertData]);
    

    return memoizedComponent;
};

/**
 * Display the given NWSAlert as a modal to get more in depth information from.
 */
export const AlertModal = (props: {alert: NWSAlert} & React.DialogHTMLAttributes<HTMLDialogElement>) => {
    const {alert, ...excess} = props;

    const alertData = alert.properties;
    const alertType = ToAlertCSS(WeatherData.GetAlertType(alert));
    
    return (
        <Modal modalTitle={alertData.event} modalTitleClass={alertType} id="alert-modal" {...excess}>
            <p><em>Issuing Office:</em> {alertData.senderName}</p>
            <p><em>Issued:</em> {GetTimeString(alertData.sent)}</p>
            <p><em>Effective:</em> {GetTimeString(alertData.effective)}</p>
            <p><em>Ends:</em> {GetTimeString(alertData.ends ?? alertData.expires)}</p>
            <hr/>
            {
                alertData.instruction && 
                <>
                    <h3>Instructions</h3>
                    <p>{alertData.instruction}</p>
                    <hr/>
                </>
            }
            {
                alertData.description.split("*").map((string, index) => {
                    if(!string.length) return <React.Fragment key={index}/>;
        
                    return <p key={index}>* {string}</p>;
                })    
            }
            <hr/>
            <h3>Affected Areas</h3>
            <p>{alertData.areaDesc}</p>
        </Modal>
    );
};