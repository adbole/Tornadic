import { multiAlert as mA, singleAlert as sA } from "__tests__/__mocks__";
import { matchBrokenText } from "__tests__/__utils__";
import { act, render, screen } from "@testing-library/react";

import Alert from "Components/Modals/Alert";

import NWSAlert from "ts/NWSAlert";


const singleAlert = sA.features.map(alert => new NWSAlert(alert as unknown as NWSAlert))

//The last alert is an expired one and is removed here to simplify testing.
//Only useNWS tests worry about that alert through its removeExpiredAlerts
const multiAlert = mA.features.map(alert => new NWSAlert(alert as unknown as NWSAlert)).slice(0, -1)


test("Renders nothing when no alerts are passed", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    
    render(<Alert alerts={[]} isOpen={true} onClose={() => undefined}/>)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(console.error).toHaveBeenCalledOnce()

    vi.mocked(console.error).mockRestore()
})

test("Renders nothing when closed", () => {
    render(<Alert alerts={singleAlert} isOpen={false} onClose={() => undefined}/>)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
})

test("If alert length is one show the alert", () => {
    render(<Alert alerts={singleAlert} isOpen={true} onClose={() => undefined}/>)

    const alert = singleAlert[0]

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
    expect.soft(screen.getByText(alert.get("event"))).toBeInTheDocument()
    expect.soft(screen.getByText(alert.get("senderName"))).toBeInTheDocument()
    expect.soft(screen.getByText(matchBrokenText(`Issued: ${alert.get("sent")}`))).toBeInTheDocument()
    expect.soft(screen.getByText(matchBrokenText(`Effective: ${alert.get("effective")}`))).toBeInTheDocument()
    expect.soft(screen.getByText(alert.get("instruction").replace("\n", " "))).toBeInTheDocument()
})

test("If alert length is greater than one show the alert list", () => {
    render(<Alert alerts={multiAlert} isOpen={true} onClose={() => undefined}/>)

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()

    multiAlert.forEach(alert => {
        expect.soft(screen.getByText(alert.get("event"))).toBeInTheDocument()
        expect.soft(screen.getByText(alert.get("sent"))).toBeInTheDocument()
    })
})

test("Clicking on an alert in the list shows the alert", () => {
    render(<Alert alerts={multiAlert} isOpen={true} onClose={() => undefined}/>)

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()

    const alert = multiAlert[0]

    act(() => {
        screen.getByText(alert.get("event")).click()
    })

    expect.soft(screen.getByText(alert.get("senderName"))).toBeInTheDocument()
    expect.soft(screen.getByText(matchBrokenText(`Effective: ${alert.get("effective")}`))).toBeInTheDocument()
    expect.soft(screen.getByText(alert.get("instruction").replace("\n", " "))).toBeInTheDocument()
})