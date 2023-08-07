import type NWSAlert from "ts/NWSAlert";


export function AlertInformationDisplay({ alert }: { alert: NWSAlert }) {
    return (
        <>
            <h2>{alert.get("event")}</h2>
            <p>
                <em>Issued:</em> {alert.get("sent")}
            </p>
            <p>
                <em>Until:</em> {alert.get("ends") ?? alert.get("expires")}
            </p>
        </>
    );
}
