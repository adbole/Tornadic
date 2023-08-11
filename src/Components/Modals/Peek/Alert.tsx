import { useBooleanState } from "Hooks";

import AlertModal from "Components/Alert/AlertModal";
import { AlertInformationDisplay } from "Components/Alert/Common";

import { usePeekWeather } from "./PeekContext";


export default function Alert() {
    const { alerts } = usePeekWeather()
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
            <div className={`peek-alert ${alertToShow.getAlertCSS()}`} onClick={showModal}>
                <div>
                    <AlertInformationDisplay alert={alertToShow} />
                </div>

                {alerts.length > 1 && (
                    <p className="excess-alerts">+{alerts.length - 1} more alert(s)</p>
                )}
            </div>
            <AlertModal alerts={alerts} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
