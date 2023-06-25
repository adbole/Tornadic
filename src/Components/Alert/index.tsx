import { useWeather } from 'Contexts/Weather';
import { useModal } from 'Contexts/ModalContext';
import * as AlertHelpers from './Common';
import { AlertModal, AlertSelectionModal } from './AlertModal';
import { Widget, WidgetSize } from 'Components/SimpleComponents';

const Alert = () => {
    const { alerts }  = useWeather();
    const modals = useModal();
    
    //If no alerts are active then don't display this component.
    if(!alerts.length) return <></>;
    
    //Determine which alert should be shown.
    const alertToShow = alerts.reduce((highest, next) => 
        AlertHelpers.determineAlertPriority(next) < AlertHelpers.determineAlertPriority(highest) ? next : highest, alerts[0]);

    const onClickHandler = () => modals.showModal(alerts.length > 1 ? <AlertSelectionModal alerts={alerts}/> : <AlertModal alert={alerts[0]}/>);

    return (
        <Widget id="alert" isTemplate size={WidgetSize.WIDE} className={AlertHelpers.getAlertCSSClass(alertToShow)} onClick={onClickHandler}>
            <div>
                <h2>{alertToShow.properties.event}</h2>
                <p><em>Issued:</em> {AlertHelpers.convertTime(alertToShow.properties.sent)}</p>
                <p><em>Until:</em> {AlertHelpers.convertTime(alertToShow.properties.ends ?? alertToShow.properties.expires)}</p>
            </div>

            {alerts.length > 1 && <p className='excess-alerts'>+{alerts.length} more alert(s)</p>}
        </Widget>
    );
};

export default Alert;

