import testIds from "@test-consts/testIDs";
import { alert_point_test, multiAlert, singleAlert, useWeather as mockUseWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { act, render, screen } from "@testing-library/react";

import { useWeather } from "Contexts/WeatherContext";

import NWSAlert from "ts/NWSAlert";

import Alert from ".";


mockDate();

vi.mock("Contexts/WeatherContext");

test("renders nothing if no alerts are active", () => {
    vi.mocked(useWeather).mockReturnValueOnce(mockUseWeather());

    render(<Alert />);

    expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).not.toBeInTheDocument();
});

test("renders nothing if no relevant alerts are active", () => {
    const singleAlertCopy = structuredClone(singleAlert);
    singleAlertCopy.features[0].properties.affectedZones = [];
    const alerts = singleAlertCopy.features.map(
        alert => new NWSAlert(alert as unknown as NWSAlert)
    );

    vi.mocked(useWeather).mockReturnValueOnce({
        ...mockUseWeather(),
        alerts,
    });

    render(<Alert />);

    expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).not.toBeInTheDocument();
});

test("shows the current active alert if only one alert is active", () => {
    const alerts = singleAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    vi.mocked(useWeather).mockReturnValueOnce({
        ...mockUseWeather(),
        alerts,
    });

    const alert = alerts[0];

    render(<Alert />);

    expect.soft(screen.queryByText(alert.get("event"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("sent"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("expires"))).toBeInTheDocument();
});

//Alert always filters out alerts that don't affect the current forecast zone.
//Therefore .not.toBeInTheDocument() is used to check that the excess alerts are not shown.
test("if multiple alerts are active, shows the highest priority and number of other alerts", () => {
    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    vi.mocked(useWeather).mockReturnValueOnce({
        ...mockUseWeather(),
        alerts,
    });

    render(<Alert />);

    const alert = alerts.reduce(
        (highest, next) => (next.priority < highest.priority ? next : highest),
        alerts[0]
    );

    expect.soft(screen.queryByText(alert.get("event"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("sent"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("expires"))).toBeInTheDocument();

    expect.soft(screen.queryByText(`+2 more alert(s)`)).toBeInTheDocument();
    expect.soft(screen.queryByText(`${alerts.length - 1} more alert(s)`)).not.toBeInTheDocument();
});

test("clicking the widget opens the alert modal", () => {
    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts,
    });

    render(<Alert />);

    act(() => {
        screen.getByTestId(testIds.Widget.WidgetSection).click();
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(screen.queryByText(`3 Weather Alerts`)).toBeInTheDocument();
    expect.soft(screen.queryByText(`${alerts.length} Weather Alerts`)).not.toBeInTheDocument();
});

test("When the user's point's forecast zone isn't in the affected array, but its geographical point is in the polygon, the alert should still show", () => {
    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));
    const point = alert_point_test as unknown as GridPoint;

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        point,
        alerts,
    });

    render(<Alert />);

    expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).toBeInTheDocument();
})

test.each([
    ["When a new alert is received, a notification is sent if permissions are granted", "granted"],
    ["When a new alert is received, a notification is not sent if permissions aren't granted", "denied"]
] as [string, PermissionState][])("%s", async (_, state) => {
    vi.stubGlobal("Notification", vi.fn())
    vi.mocked(navigator.permissions.query).mockResolvedValue({
        state,
    } as PermissionStatus);

    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    //After the first alert mock, the 2nd, 3rd, and 4th alert contain the default mock zone, 
    //so the 3rd and 4th alerts are used here for testing
    const firstSend = alerts.slice(3)
    const secondSend = alerts.slice(2)

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts: firstSend,
    });

    render(<Alert />)

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts: secondSend,
    });

    await act(async () => {
        await vi.advanceTimersToNextTimerAsync()
    })

    if(state === "granted") {
        expect(Notification).toHaveBeenCalledOnce()

        const alert = secondSend[0]
        expect(Notification).toHaveBeenCalledWith(
            alert.get("event"),
            {
                body: `Issued: ${alert.get("sent")}\nExpires: ${alert.get("expires")}`
            }
        )
    }
    else {
        expect(Notification).not.toHaveBeenCalled()
    }

    vi.mocked(Notification).mockRestore()
})

test("If multiple alerts are sent, the notification shows the highest priority with a more section", async () => {
    vi.stubGlobal("Notification", vi.fn())

    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    //After the first alert mock, the 2nd, 3rd, and 4th alert contain the default mock zone, 
    const firstSend = alerts.slice(3)

    //Includes the first
    const secondSend = alerts.slice(0)

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts: firstSend,
    });

    render(<Alert />)

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts: secondSend,
    });

    await act(async () => {
        await vi.advanceTimersToNextTimerAsync()
    })

    expect(Notification).toHaveBeenCalledOnce()

    //Includes an irrelevant alert to ensure notifications are accounting for them.
    // third element has higher priority
    const alert = secondSend[2]
    expect(Notification).toHaveBeenCalledWith(
        alert.get("event"),
        {
            body: `Issued: ${alert.get("sent")}\nExpires: ${alert.get("expires")}\n+1 more alert(s)`
        }
    )

    vi.mocked(Notification).mockRestore()
})