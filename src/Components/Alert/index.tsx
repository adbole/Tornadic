import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Widget from "Components/Widget";

import AlertModal from "./AlertModal";
import { AlertInformationDisplay } from "./Common";


export default function Alert() {
    const { alerts } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    //If no alerts are active then don't display this component.
    if (!alerts.length) return <></>;

    //Determine which alert should be shown.
    const alertToShow = alerts.reduce(
        (highest, next) => (next.priority < highest.priority ? next : highest),
        alerts[0]
    );

    return (
        <>
            <Widget
                id="alert"
                isTemplate
                size={"widget-wide"}
                className={alertToShow.getAlertCSS()}
                onClick={showModal}
            >
                <div>
                    <AlertInformationDisplay alert={alertToShow} />
                </div>

                {alerts.length > 1 && (
                    <p className="excess-alerts">+{alerts.length - 1} more alert(s)</p>
                )}
            </Widget>
            <AlertModal alerts={alerts} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
