import NWSAlert from "ts/NWSAlert";


const generateAlert = (event: string) => new NWSAlert({
    properties: {
        id: "123",
        areaDesc: "Test Area",
        sent: "2023-01-01T00:00Z",
        effective: "2023-01-01T01:00Z",
        expires: "2023-01-01T02:00Z",
        ends: "2023-01-01T03:00Z",
        severity: "Moderate",
        certantiy: "Likely",
        urgency: "Immediate",
        event,
        senderName: "NWS",
        headline: "Tornado Warning for Test Area",
        description: "A tornado warning has been issued for Test Area.",
        instruction: "Take shelter immediately.",
        response: "Evacuate",
        affectedZones: ["Zone 1", "Zone 2"],
        messageType: "Alert",
        references: [{ identifier: "123" }],
        parameters: { expiredReferences: [] },
    },
    type: "Feature",
    geometry: null,
} as unknown as NWSAlert)

const alertTest = test.extend({ alert: generateAlert("Tornado Warning") })

describe("priority, css", () => {
    alertTest("warning", ({ alert }) => {
        expect.soft(alert.priority).toBe(1);
        expect.soft(alert.getAlertCSS()).toBe("warning")
    });

    test("advisory", () => {
        const alert = generateAlert("Tornado Advisory");
        expect.soft(alert.priority).toBe(2);
        expect.soft(alert.getAlertCSS()).toBe("advisory")
    })

    test("statement", () => {
        const alert = generateAlert("Tornado Statement");
        expect.soft(alert.priority).toBe(3);
        expect.soft(alert.getAlertCSS()).toBe("statement")
    })

    test("watch", () => {
        const alert = generateAlert("Tornado Watch");
        expect.soft(alert.priority).toBe(4);
        expect.soft(alert.getAlertCSS()).toBe("watch")
    })

    test("test", () => {
        const alert = generateAlert("Tornado Test");
        expect.soft(alert.priority).toBe(5);
        expect.soft(alert.getAlertCSS()).toBe("none")
    })
})

// This test should be updated if more parameters are added to ensure
// all params are accessible.
alertTest("should return the correct parameter value", ({ alert }) => {
    expect(alert.getParameter("expiredReferences")).toEqual([]);
});

alertTest("should format date properties correctly", ({ alert }) => {
    expect.soft(alert.get("sent")).toBe("Sun, Jan 1, 12:00 AM UTC");
    expect.soft(alert.get("effective")).toBe("Sun, Jan 1, 1:00 AM UTC");
    expect.soft(alert.get("expires")).toBe("Sun, Jan 1, 2:00 AM UTC");
    expect.soft(alert.get("ends")).toBe("Sun, Jan 1, 3:00 AM UTC");
});

test("shouldn't format a property if it is null", () => {
    const alert = generateAlert("Tornado Warning");
    /* @ts-expect-error with null assignment*/
    alert.properties.sent = null;

    expect(alert.get("sent")).toBe(null);
})

describe("hasCoords", () => {
    test("should return false if geometry is null", () => {
        const alert = generateAlert("Tornado Warning");
        expect(alert.hasCoords()).toBe(false);
    });

    test("should return true if geometry is not null", () => {
        const alert = generateAlert("Tornado Warning");

        /* @ts-expect-error with readonly assignment */
        alert.geometry = { type: "Point", coordinates: [0, 0] };
        expect(alert.hasCoords()).toBe(true);
    });
});