import * as Helpers from "ts/Helpers";


describe("Normalize", () => {
    test("Decimal", () => {
        expect.soft(Helpers.Normalize.Decimal(1, 0, 10)).toBe(0.1);
        expect.soft(Helpers.Normalize.Decimal(5, 0, 10)).toBe(0.5);
        expect.soft(Helpers.Normalize.Decimal(10, 0, 10)).toBe(1);
    });

    test("Percent", () => {
        expect.soft(Helpers.Normalize.Percent(1, 0, 10)).toBe(10);
        expect.soft(Helpers.Normalize.Percent(5, 0, 10)).toBe(50);
        expect.soft(Helpers.Normalize.Percent(10, 0, 10)).toBe(100);
    });
});

test("get_aq", () => {
    expect.soft(Helpers.get_aq(0)).toBe("Good");
    expect.soft(Helpers.get_aq(50)).toBe("Good");

    expect.soft(Helpers.get_aq(51)).toBe("Moderate");
    expect.soft(Helpers.get_aq(100)).toBe("Moderate");

    expect.soft(Helpers.get_aq(101)).toBe("Unhealthy*");
    expect.soft(Helpers.get_aq(150)).toBe("Unhealthy*");

    expect.soft(Helpers.get_aq(151)).toBe("Unhealthy");
    expect.soft(Helpers.get_aq(200)).toBe("Unhealthy");

    expect.soft(Helpers.get_aq(201)).toBe("Very Unhealthy");
    expect.soft(Helpers.get_aq(300)).toBe("Very Unhealthy");

    expect.soft(Helpers.get_aq(301)).toBe("Hazardous");
    expect.soft(Helpers.get_aq(500)).toBe("Hazardous");
});

test("get_uv", () => {
    expect.soft(Helpers.get_uv(0)).toBe("Low");
    expect.soft(Helpers.get_uv(2)).toBe("Low");

    expect.soft(Helpers.get_uv(3)).toBe("Moderate");
    expect.soft(Helpers.get_uv(5)).toBe("Moderate");

    expect.soft(Helpers.get_uv(6)).toBe("High");
    expect.soft(Helpers.get_uv(7)).toBe("High");

    expect.soft(Helpers.get_uv(8)).toBe("Very High");
    expect.soft(Helpers.get_uv(10)).toBe("Very High");

    expect.soft(Helpers.get_uv(11)).toBe("Extreme");
});

test("toHSL", () => {
    expect.soft(Helpers.toHSL(0, "fahrenheit")).toBe("hsl(250deg, 100%, 50%)");
    expect.soft(Helpers.toHSL(60, "fahrenheit")).toBe("hsl(125deg, 100%, 50%)");
    expect.soft(Helpers.toHSL(120, "fahrenheit")).toBe("hsl(0deg, 100%, 50%)");

    expect.soft(Helpers.toHSL(0, "celsius")).toBe("hsl(250deg, 100%, 50%)");
    expect.soft(Helpers.toHSL(22.5, "celsius")).toBe("hsl(125deg, 100%, 50%)");
    expect.soft(Helpers.toHSL(45, "celsius")).toBe("hsl(0deg, 100%, 50%)");
});

test("throwError", () => {
    expect(() => Helpers.throwError("test")).toThrow("test");
});

test("randomBetween", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.5).mockReturnValueOnce(1);

    expect.soft(Helpers.randomBetween(0, 100)).toBe(0);
    expect.soft(Helpers.randomBetween(0, 100)).toBe(50);
    expect.soft(Helpers.randomBetween(0, 100)).toBe(100);
});

test("trunc truncates a value to at most 2 decimal places and rounds if needed", () => {
    //Basic
    expect.soft(Helpers.trunc(1.234)).toBe(1.23);
    expect.soft(Helpers.trunc(1.2345)).toBe(1.23);
    expect.soft(Helpers.trunc(1)).toBe(1);
    expect.soft(Helpers.trunc(0.23)).toBe(0.23);

    //Edge Cases (ensures floating point innacuracies are handled correctly)
    expect.soft(Helpers.trunc(69.1)).toBe(69.1);
    expect.soft(Helpers.trunc(1.1)).toBe(1.1);
    expect.soft(Helpers.trunc(1.005)).toBe(1.01);
});

test("getTimeToNextHour", () => {
    vi.useFakeTimers();

    vi.setSystemTime(0);
    expect.soft(Helpers.getTimeToNextHour()).toBe(3.6e6);

    vi.setSystemTime(3.6e6 / 2);
    expect.soft(Helpers.getTimeToNextHour()).toBe(3.6e6 / 2);

    vi.setSystemTime(3.6e6 / 4);
    expect.soft(Helpers.getTimeToNextHour()).toBe(3.6e6 - 3.6e6 / 4);

    vi.useRealTimers();
});

//nameof tests are omitted as vitest typecheck incorrectly marks other parts of code with errors.
