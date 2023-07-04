import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import { Widget, WidgetSize } from "Components/SimpleComponents";

import AlertModal from "./AlertModal";
import { AlertInformationDisplay } from "./Common";


const Alert = () => {
    const { alerts }  = useWeather();
    const modals = useModal();
    
    //If no alerts are active then don't display this component.
    if(!alerts.length) return <></>;
    
    //Determine which alert should be shown.
    const alertToShow = alerts.reduce((highest, next) => next.priority < highest.priority ? next : highest, alerts[0]);

    return (
        <Widget 
            id="alert" 
            isTemplate 
            size={WidgetSize.WIDE} 
            className={alertToShow.getAlertCSS()} 
            onClick={() => modals.showModal(<AlertModal alerts={alerts}/>)}
        >
            <div>
                <AlertInformationDisplay alert={alertToShow}/>
            </div>

            {alerts.length > 1 && <p className='excess-alerts'>+{alerts.length - 1} more alert(s)</p>}
        </Widget>
    );
};

export default Alert;

