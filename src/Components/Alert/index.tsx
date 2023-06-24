import { useWeather } from 'Contexts/Weather';
import { useModal } from 'Contexts/ModalContext';
import { AlertDisplay, AlertHelpers } from './Common';
import { AlertModal, AlertSelectionModal } from './AlertModal';

const Alert = () => {
    const { alerts }  = useWeather();
    const modals = useModal();
    
    //If no alerts are active then don't display this component.
    if(!alerts.length) return <></>;
    
    //Determine which alert should be shown.
    const alertToShow = alerts.reduce((highest, next) => 
        AlertHelpers.DetermineAlertPriority(next) < AlertHelpers.DetermineAlertPriority(highest) ? next : highest, alerts[0]);

    const onClickHandler = () => modals.showModal(alerts.length > 1 ? <AlertSelectionModal alerts={alerts}/> : <AlertModal alert={alerts[0]}/>);

    return <AlertDisplay id="alert" alert={alertToShow} onClick={onClickHandler}/>;
};

export default Alert;

