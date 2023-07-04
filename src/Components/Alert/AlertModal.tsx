import React from "react";

import { Modal, ModalContent, ModalTitle } from "Contexts/ModalContext";
import SlideContextProvider, { useSlide } from "Contexts/SlideContext";

import { Widget } from "Components/SimpleComponents";

import NWSAlert from "ts/NWSAlert";

import { AlertInformationDisplay } from "./Common";


/**
 * @returns An alert modal showing a single alert if alerts.length = 1 otherwise shows a list
 */
const AlertModal = ({ alerts }: { alerts: NWSAlert[] }) => {
    if(alerts.length > 1) {
        return (
            <Modal id="alert-list-modal">
                <SlideContextProvider>
                    <ModalTitle>
                        {alerts.length} Weather Alerts
                    </ModalTitle>
                    <ModalContent>
                        {alerts.map((alert) => <AlertDisplaySelectionWrapper key={alert.get("id")} alert={alert}/>)}
                    </ModalContent>
                </SlideContextProvider>
            </Modal>
        );
    }
    else {
        return (
            <Modal>
                <AlertModalBody alert={alerts[0]}/>
            </Modal>
        );
    }
};

const AlertDisplaySelectionWrapper = ({ alert }: { alert: NWSAlert }) => {
    const { slideTo, reset } = useSlide();

    const onClickHandler = () => slideTo(<AlertModalBody alert={alert} onClick={reset}/>);
    
    return (
        <Widget className={alert.getAlertCSS()} onClick={onClickHandler}>
            <AlertInformationDisplay alert={alert}/>
        </Widget>
    );
};

const AlertModalBody = ({ alert, onClick }: { alert: NWSAlert, onClick?: (e: React.MouseEvent<HTMLHeadingElement>) => void }) => (
    <>
        <ModalTitle className={alert.getAlertCSS()} onClick={onClick}>{alert.get("event")}</ModalTitle>
        <ModalContent>
            <p><em>Issuing Office:</em> {alert.get("senderName")}</p>
            <p><em>Issued:</em> {alert.get("sent")}</p>
            <p><em>Effective:</em> {alert.get("effective")}</p>
            <p><em>Ends:</em> {alert.get("ends") ?? alert.get("expires")}</p>
            <hr/>
            {
                alert.get("instruction") && 
                <>
                    <h3>Instructions</h3>
                    <p>{alert.get("instruction")}</p>
                    <hr/>
                </>
            }
            {
                alert.get("description").split("*").map((string, index) => {
                    if(!string.length) return <React.Fragment key={index}/>;

                    return <p key={index}>* {string}</p>;
                })    
            }
            <hr/>
            <h3>Affected Areas</h3>
            <p>{alert.get("areaDesc")}</p>
        </ModalContent>
    </>
);

export default AlertModal;