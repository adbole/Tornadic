import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Widget from "Components/Widget";

import { alertColors } from "ts/StyleMixins";

import AlertModal from "./AlertModal";
import { AlertInformationDisplay } from "./Common";


const AlertWidget = styled(Widget)<{
    type: keyof typeof alertColors;
}>(({ type }) => [
    {
        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "1fr",
        padding: "0px",
        "> *": {
            paddingLeft: "10px",
            paddingRight: "10px",

            "&:first-of-type": { paddingTop: "10px" },
            "&:last-of-type": { paddingBottom: "10px" },
        },
    },
    {
        backgroundColor: alertColors[type].background,
        color: alertColors[type].foreground,
    },
]);

const AlertInformation = styled.div({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
});

const ExcessAlerts = styled.p({
    paddingTop: "10px",
    background: "rgba(0, 0, 0, 0.3)",
});

function Alert() {
    const { alerts } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    //If no alerts are active then don't display this component.
    if (!alerts.length) return null;

    //Determine which alert should be shown.
    const alertToShow = alerts.reduce(
        (highest, next) => (next.priority < highest.priority ? next : highest),
        alerts[0]
    );

    return (
        <>
            <AlertWidget
                type={alertToShow.getAlertCSS() as any}
                isTemplate
                size={"widget-wide"}
                onClick={showModal}
            >
                <AlertInformation>
                    <AlertInformationDisplay alert={alertToShow} />
                </AlertInformation>

                {alerts.length > 1 && (
                    <ExcessAlerts>+{alerts.length - 1} more alert(s)</ExcessAlerts>
                )}
            </AlertWidget>
            <AlertModal alerts={alerts} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}

Alert.Style = AlertWidget;

export default Alert;
