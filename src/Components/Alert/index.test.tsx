import testIds from "@test-consts/testIDs";
import { multiAlert, singleAlert, useWeather as mockUseWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { act, render, screen } from "@testing-library/react";

import { useWeather } from "Contexts/WeatherContext";

import NWSAlert from "ts/NWSAlert";

import Alert from ".";


mockDate();

vi.mock("Contexts/WeatherContext");

//setupTests.ts unstub's all globals by default after each test
beforeEach(() => {
    vi.stubGlobal("Notification", vi.fn())
})

test("renders nothing if no alerts are active", async () => {
    vi.mocked(useWeather).mockReturnValue(mockUseWeather());

    render(<Alert />);

    //Wait for effect to run
    await act(async () => {
        await vi.runOnlyPendingTimersAsync()
    })

    expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).not.toBeInTheDocument();
});

test("shows the current active alert if only one alert is active", async () => {
    const alerts = singleAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts,
    });

    const alert = alerts[0];

    render(<Alert />);

    //Wait for effect to run
    await act(async () => {
        await vi.runOnlyPendingTimersAsync()
    })

    expect.soft(screen.queryByText(alert.get("event"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("sent"))).toBeInTheDocument();
    expect.soft(screen.queryByText(alert.get("expires"))).toBeInTheDocument();
});

//Alert always filters out alerts that don't affect the current forecast zone.
//Therefore .not.toBeInTheDocument() is used to check that the excess alerts are not shown.
test("if multiple alerts are active, shows the highest priority and number of other alerts", async () => {
    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts,
    });

    render(<Alert />);

    //Wait for effect to run
    await act(async () => {
        await vi.runOnlyPendingTimersAsync()
    })

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

test("clicking the widget opens the alert modal", async () => {
    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

    vi.mocked(useWeather).mockReturnValue({
        ...mockUseWeather(),
        alerts,
    });

    render(<Alert />);

    await act(async () => {
        await vi.runOnlyPendingTimersAsync()
        screen.getByTestId(testIds.Widget.WidgetSection).click();
    })

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(screen.queryByText(`3 Weather Alerts`)).toBeInTheDocument();
    expect.soft(screen.queryByText(`${alerts.length} Weather Alerts`)).not.toBeInTheDocument();
});

describe("Relevant Alerts", () => {
    test("Renders nothing if no relevant alerts are active", async () => {
        const singleAlertCopy = structuredClone(singleAlert);
        singleAlertCopy.features[0].geometry = null as any
        singleAlertCopy.features[0].properties.affectedZones = [];
        
        const alerts = singleAlertCopy.features.map(
            alert => new NWSAlert(alert as unknown as NWSAlert)
        );
    
        vi.mocked(useWeather).mockReturnValue({
            ...mockUseWeather(),
            alerts,
        });
    
        render(<Alert />);
    
        //Wait for effect to run
        await act(async () => {
            await vi.runOnlyPendingTimersAsync()
        })
    
        expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).not.toBeInTheDocument();
    });

    test("Renders when the user's forecast zone is in the alert's affected array, but not its geograpihcal point", async () => {
        const singleAlertCopy = structuredClone(singleAlert);
        singleAlertCopy.features[0].geometry = null as any
        
        const alerts = singleAlertCopy.features.map(
            alert => new NWSAlert(alert as unknown as NWSAlert)
        );
    
        vi.mocked(useWeather).mockReturnValue({
            ...mockUseWeather(),
            alerts,
        });
    
        render(<Alert />);
    
        //Wait for effect to run
        await act(async () => {
            await vi.runOnlyPendingTimersAsync()
        })
    
        expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).toBeInTheDocument();
    });

    test("Renders when the user's point's forecast zone isn't in the affected array, but its geographical point is in the polygon", async () => {
        const singleAlertCopy = structuredClone(singleAlert);
        singleAlertCopy.features[0].properties.affectedZones = [];
          
        const alerts = singleAlertCopy.features.map(
            alert => new NWSAlert(alert as unknown as NWSAlert)
        );
    
        vi.mocked(useWeather).mockReturnValue({
            ...mockUseWeather(),
            alerts,
        });
    
        render(<Alert />);

        //Wait for effect to run
        await act(async () => {
            await vi.runOnlyPendingTimersAsync()
        })
    
        expect.soft(screen.queryByTestId(testIds.Widget.WidgetSection)).toBeInTheDocument();
    })
})

describe("Notifications", () => {
    test.each([
        ["When a new alert is received, a notification is sent if permissions are granted", "granted"],
        ["When a new alert is received, a notification is not sent if permissions aren't granted", "denied"]
    ] as [string, PermissionState][])("%s", async (_, state) => {
        vi.mocked(navigator.permissions.query).mockResolvedValue({
            state,
        } as PermissionStatus);
    
        const alerts = multiAlert.features
            .map(alert => new NWSAlert(alert as unknown as NWSAlert))
            .sort((a, b) => (new Date(b.get("sent")).getTime()) - (new Date(a.get("sent")).getTime()));

    
        //First and second alert contain the default mock zone, 
        const firstSend = alerts.slice(1)
        const secondSend = alerts.slice(0)
    
        vi.mocked(useWeather).mockReturnValue({
            ...mockUseWeather(),
            alerts: firstSend,
        });
    
        render(<Alert />)

        await act(async () => {
            vi.mocked(useWeather).mockReturnValue({
                ...mockUseWeather(),
                alerts: secondSend,
            });

            await vi.runOnlyPendingTimersAsync()
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
    })
    
    test("If multiple alerts are sent, the notification shows the highest priority with a more section", async () => {
        vi.stubGlobal("Notification", vi.fn())
    
        const alerts = multiAlert.features
            .map(alert => new NWSAlert(alert as unknown as NWSAlert))
    
        //First, second, third alert contain the default mock zone, 
        const firstSend = alerts.slice(2)
        const secondSend = alerts.slice(0)
            
    
        vi.mocked(useWeather).mockReturnValue({
            ...mockUseWeather(),
            alerts: firstSend,
        });
    
        render(<Alert />)
    
        await act(async () => {
            vi.mocked(useWeather).mockReturnValue({
                ...mockUseWeather(),
                alerts: secondSend,
            });

            await vi.advanceTimersToNextTimerAsync()
        })
    
        expect(Notification).toHaveBeenCalledOnce()
    
        // 0 is test, 1 is rip current statement, so 1 has higher priority
        const alert = secondSend[1]
        expect(Notification).toHaveBeenCalledWith(
            alert.get("event"),
            {
                body: `Issued: ${alert.get("sent")}\nExpires: ${alert.get("expires")}\n+1 more alert(s)`
            }
        )
    
        vi.mocked(Notification).mockRestore()
    })

    test("When noNotify is true, notifications aren't sent", async () => {
        vi.mocked(navigator.permissions.query).mockResolvedValue({
            state: "granted",
        } as PermissionStatus);
    
        const alerts = multiAlert.features
            .map(alert => new NWSAlert(alert as unknown as NWSAlert))
            .sort((a, b) => (new Date(b.get("sent")).getTime()) - (new Date(a.get("sent")).getTime()));

        //First and second alert contain the default mock zone, 
        const firstSend = alerts.slice(1)
        const secondSend = alerts.slice(0)
    
        vi.mocked(useWeather).mockReturnValue({
            ...mockUseWeather(),
            alerts: firstSend,
        });
    
        render(<Alert noNotify/>)

        await act(async () => {
            vi.mocked(useWeather).mockReturnValue({
                ...mockUseWeather(),
                alerts: secondSend,
            });

            await vi.runOnlyPendingTimersAsync()
        })
    
        expect(Notification).not.toHaveBeenCalled()    
    })
})