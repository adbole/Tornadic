import { useWeather } from '../Contexes/WeatherContext';
import { useModal } from '../Contexes/ModalContext';
import { AlertDisplay, AlertHelpers } from './Alert.Common';
import { AlertModal, AlertSelectionModal } from './Alert.Modal';

const Alert = () => {
    const alertData = useWeather().alerts;
    const modals = useModal();
    
    //If no alerts are active then don't display this component.
    if(!alertData.length) return <></>;
    
    //Determine which alert should be shown.
    const alertToShow = alertData.reduce((highest, next) => 
        AlertHelpers.DetermineAlertPriority(next) < AlertHelpers.DetermineAlertPriority(highest) ? next : highest, alertData[0]);

    const onClickHandler = () => modals.showModal(alertData.length > 1 ? <AlertSelectionModal alert={alertData}/> : <AlertModal alert={alertData[0]}/>);

    return <AlertDisplay id="alert" alert={alertToShow} onClick={onClickHandler}/>;
};

export default Alert;

