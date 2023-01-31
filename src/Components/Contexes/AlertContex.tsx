/**
 * The AlertContext sets up the modals to display Alert information. This is done as the alert component and the radar will need display
 * the same modals and this context prevents the need for duplicates.
 */

import ReactDOM from 'react-dom';
import React, { ReactNode } from 'react';
import { useWeather } from './WeatherContext';
import { Modal } from '../Modal';
import { WeatherData } from '../../ts/WeatherData';

type AlertContext = {
    showAlert: React.Dispatch<React.SetStateAction<number>>
}

const Context = React.createContext<AlertContext | null>(null);

export function useAlert() {
    const contextInstance = React.useContext(Context);

    if(!contextInstance) {
        throw new Error("Please use useAlert inside an AlertContext provider");
    } 
    else {
        return contextInstance;
    }
}

function GetTimeString(iso: string) {
    return new Date(iso).toLocaleTimeString("en-us", {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"});
}

const AlertContextProvider = ({children} : {children: ReactNode}) => {
    const alertData = useWeather().alerts;
    const [activeIndex, setActiveIndex] = React.useState(-1);
    let portal;

    if(alertData.length > 0 && activeIndex !== -1) {
        const currentAlert = alertData[activeIndex].properties;
        const alertType = WeatherData.GetAlertType(alertData[activeIndex]) ?? "";

        const AlertModal = (
            <Modal modalTitle={currentAlert.event} modalTitleClass={alertType} onClose={() => setActiveIndex(-1)}>
                <p><em>Issuing Office:</em> {currentAlert.senderName}</p>
                <p><em>Issued:</em> {GetTimeString(currentAlert.sent)}</p>
                <p><em>Effective:</em> {GetTimeString(currentAlert.effective)}</p>
                <p><em>Ends:</em> {GetTimeString(currentAlert.ends)}</p>
                <hr/>
                {
                    currentAlert.description.split("*").map((string, index) => {
                        if(!string.length) return <React.Fragment key={index}/>;

                        return <p key={index}>* {string}</p>;
                    })    
                }
                <hr/>
                <h3>Affected Areas</h3>
                <p>{currentAlert.areaDesc}</p>
                <h3>Instructions</h3>
                <p>{currentAlert.instruction}</p>
            </Modal>
        );

        portal = ReactDOM.createPortal(AlertModal, document.body);
    }

    return (
        <Context.Provider value={{showAlert: setActiveIndex}}>
            {children}
            {portal}
        </Context.Provider>
    );
};

export default AlertContextProvider;