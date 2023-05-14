import { WeatherData } from '../../ts/WeatherData';
import { useWeather } from '../Contexes/WeatherContext';
import { useModal } from '../Contexes/ModalContext';
import { AlertDisplay } from './Alert.Common';
import { AlertModal, AlertSelectionModal } from './Alert.Modal';

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
    
    const onClickHandler = () => modals.showModal(alertData.length > 0 ? <AlertSelectionModal alert={alertData}/> : <AlertModal alert={alertData[0]}/>);

    return <AlertDisplay id="alert" alert={alertToShow} onClick={onClickHandler}/>;
};

export default Alert;

