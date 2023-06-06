import React from 'react';
import { NWSAlert } from 'Components/Contexts/Weather/index.types';
import { Modal, ModalContent, ModalTitle } from 'Components/Contexts/ModalContext';
import SlideContextProvider, { useSlide } from 'Components/Contexts/SlideContext';
import { AlertDisplay, AlertHelpers } from './Common';

export const AlertSelectionModal = ({alerts}: {alerts: NWSAlert[]}) => {
    //Memoize the component to prevent unnecessary operations
    const memoizedComponent = React.useMemo(() => (
        <Modal id="alert-list-modal">
            <SlideContextProvider>
                <ModalTitle>
                    {alerts.length} Weather Alerts
                </ModalTitle>
                <ModalContent>
                    {alerts.map((alert, index) => <AlertDisplaySelectionWrapper key={index} alert={alert}/>)}
                </ModalContent>
            </SlideContextProvider>
        </Modal>
    ),[alerts]);
    

    return memoizedComponent;
};


const AlertDisplaySelectionWrapper = ({alert}: {alert: NWSAlert}) => {
    const slideOver = useSlide();

    const onClickHandler = () => slideOver.slideTo(<AlertModalBody alert={alert} onClick={() => slideOver.reset()}/>);
    
    return <AlertDisplay alert={alert} onClick={onClickHandler}/>;
};

/**
 * Display the given NWSAlert as a modal to get more in depth information from.
 */
export const AlertModal = (props: {alert: NWSAlert} & React.DialogHTMLAttributes<HTMLDialogElement>) => {
    const {alert, ...excess} = props;
    
    return (
        <Modal id="alert-modal" {...excess}>
            <AlertModalBody alert={alert}/>
        </Modal>
    );
};


const AlertModalBody = ({alert, onClick}: {alert: NWSAlert, onClick?: (e: React.MouseEvent<HTMLHeadingElement>) => void}) => (
    <>
        <ModalTitle className={AlertHelpers.GetAlertCSSClass(alert)} onClick={onClick}>{alert.properties.event}</ModalTitle>
        <ModalContent>
            <p><em>Issuing Office:</em> {alert.properties.senderName}</p>
            <p><em>Issued:</em> {AlertHelpers.ConvertTime(alert.properties.sent)}</p>
            <p><em>Effective:</em> {AlertHelpers.ConvertTime(alert.properties.effective)}</p>
            <p><em>Ends:</em> {AlertHelpers.ConvertTime(alert.properties.ends ?? alert.properties.expires)}</p>
            <hr/>
            {
                alert.properties.instruction && 
                <>
                    <h3>Instructions</h3>
                    <p>{alert.properties.instruction}</p>
                    <hr/>
                </>
            }
            {
                alert.properties.description.split("*").map((string, index) => {
                    if(!string.length) return <React.Fragment key={index}/>;

                    return <p key={index}>* {string}</p>;
                })    
            }
            <hr/>
            <h3>Affected Areas</h3>
            <p>{alert.properties.areaDesc}</p>
        </ModalContent>
    </>
);