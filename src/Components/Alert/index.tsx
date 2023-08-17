import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import AlertModal from "Components/Modals/Alert";

import AlertWidget, { AlertInformation, ExcessAlerts } from "./style";


function Alert({ className }: ClassNameProp) {
    const { alerts } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    //If no alerts are active then don't display this component.
    if (!alerts.length) return null;

    //Determine which alert should be shown.
    const alert = alerts.reduce(
        (highest, next) => (next.priority < highest.priority ? next : highest),
        alerts[0]
    );

    return (
        <>
            <AlertWidget
                className={className}
                type={alert.getAlertCSS() as any}
                isTemplate
                size="widget-wide"
                onClick={showModal}
            >
                <AlertInformation>
                    <h2>{alert.get("event")}</h2>
                    <p>
                        <em>Issued:</em> {alert.get("sent")}
                    </p>
                    <p>
                        <em>Until:</em> {alert.get("ends") ?? alert.get("expires")}
                    </p>
                </AlertInformation>

                {alerts.length > 1 && (
                    <ExcessAlerts>+{alerts.length - 1} more alert(s)</ExcessAlerts>
                )}
            </AlertWidget>
            <AlertModal isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}

export default Alert;
