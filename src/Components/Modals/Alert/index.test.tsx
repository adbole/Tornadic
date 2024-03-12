import { multiAlert as mA, singleAlert as sA } from "@test-mocks";
import { matchBrokenText } from "@test-utils";

import { act, render, screen } from "@testing-library/react";

import NWSAlert from "ts/NWSAlert";

import Alert from ".";


const singleAlert = sA.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

//The last alert is an expired one and is removed here to simplify testing.
//Only useNWS tests worry about that alert through its removeExpiredAlerts
const multiAlert = mA.features
    .map(alert => new NWSAlert(alert as unknown as NWSAlert))
    .slice(0, -1);

test("Renders nothing when no alerts are passed", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<Alert alerts={[]} isOpen={true} onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(console.error).toHaveBeenCalledOnce();

    vi.mocked(console.error).mockRestore();
});

test("Renders nothing when closed", () => {
    render(<Alert alerts={singleAlert} isOpen={false} onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("If alert length is one show the alert", () => {
    render(<Alert alerts={singleAlert} isOpen={true} onClose={() => undefined} />);

    const alert = singleAlert[0];

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("event"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("senderName"))).toBeInTheDocument();
    expect
        .soft(screen.queryByText(matchBrokenText(`Issued: ${alert.get("sent")}`)))
        .toBeInTheDocument();
    expect
        .soft(screen.queryByText(matchBrokenText(`Effective: ${alert.get("effective")}`)))
        .toBeInTheDocument();
    expect
        .soft(screen.queryByText(alert.get("instruction").replace("\n", " ")))
        .toBeInTheDocument();
});

test("If alert length is greater than one show the alert list", () => {
    render(<Alert alerts={multiAlert} isOpen={true} onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).toBeInTheDocument();

    multiAlert.forEach(alert => {
        expect.soft(screen.queryByText(alert.get("event"))).toBeInTheDocument();
        expect.soft(screen.queryByText(alert.get("sent"))).toBeInTheDocument();
    });
});

test("Clicking on an alert in the list shows the alert", () => {
    render(<Alert alerts={multiAlert} isOpen={true} onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).toBeInTheDocument();

    const alert = multiAlert[0];

    act(() => {
        screen.getByText(alert.get("event")).click();
    });

    expect.soft(screen.queryByText(alert.get("senderName"))).toBeInTheDocument();
    expect
        .soft(screen.queryByText(matchBrokenText(`Effective: ${alert.get("effective")}`)))
        .toBeInTheDocument();
    expect
        .soft(screen.getByText(alert.get("instruction")))
        .toBeInTheDocument();
});