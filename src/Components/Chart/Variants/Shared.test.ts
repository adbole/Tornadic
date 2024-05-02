import { getMinMaxFunc } from "./Shared";


describe("getMinMaxFunc", () => {
    test("surface_pressure", () => {
        const minMaxFunc = getMinMaxFunc("surface_pressure");

        expect.soft(minMaxFunc).toBeDefined();
        expect.soft(minMaxFunc!([0, 1])).toEqual([-0.3, 1.3]);
    });

    test("precipitation", () => {
        const minMaxFunc = getMinMaxFunc("precipitation");

        expect.soft(minMaxFunc).toBeDefined();
        expect.soft(minMaxFunc!([0, 1])).toEqual([0, 1.25]);
        expect.soft(minMaxFunc!([-1, 0])).toEqual([0, 0.5]);
    });

    test("Returns the correct function for relativehumidity_2m", () => {
        const minMaxFunc = getMinMaxFunc("relativehumidity_2m");

        expect(minMaxFunc).toBeDefined();
        expect(minMaxFunc!([0, 1])).toEqual([0, 100]);
        expect(minMaxFunc!([-1, 200])).toEqual([0, 100]);
    });

    test("Returns the correct function for uv_index", () => {
        const minMaxFunc = getMinMaxFunc("uv_index");

        expect(minMaxFunc).toBeDefined();
        expect(minMaxFunc!([0, 1])).toEqual([0, 11]);
        expect(minMaxFunc!([-1, 15])).toEqual([0, 15]);
    });

    test("Returns undefined for all other views", () => {
        const other = [
            "temperature_2m",
            "dewpoint_2m",
            "visibility",
            "windspeed_10m",
            "us_aqi",
        ] as ChartViews[];

        other.forEach(view => {
            expect(getMinMaxFunc(view)).toBeUndefined();
        });
    });
});
