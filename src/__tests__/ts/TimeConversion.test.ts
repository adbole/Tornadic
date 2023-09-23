import getTimeFormatted from "ts/TimeConversion";


beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-01T12:00:00.000Z"));
});

afterAll(() => {
    vi.useRealTimers();
});

test("weekday", () => {
    console.log(process.env.TZ)
    const result = getTimeFormatted(new Date(), "weekday");

    expect(result).toEqual("Sun");
});

test("hour", () => {
    const result = getTimeFormatted(new Date(), "hour");
    expect(result).toEqual("12 PM");
});

test("hourMinute", () => {
    const result = getTimeFormatted(new Date(), "hourMinute");
    expect(result).toEqual("12:00 PM");
});

test("date", () => {
    const result = getTimeFormatted(new Date(), "date");
    expect(result).toEqual("Sunday, Jan 1");
});

test("dateTime", () => {
    const result = getTimeFormatted(new Date(), "dateTime");

    expect(result).toMatch("Sun, Jan 1, 12:00 PM UTC");
});
