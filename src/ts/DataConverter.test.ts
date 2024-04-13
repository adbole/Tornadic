import DEFAULTS from "Hooks/useLocalStorage.config";

import DataConverter from "./DataConverter";


test("When using default settings, units are converted correctly", () => {
    const dataConverter = new DataConverter(DEFAULTS.userSettings);

    expect.soft(dataConverter.convert("surface_pressure", [1000])).toBeCloseTo(29.53, 3);
    expect.soft(dataConverter.convert("visibility", [5280 * 2])).toEqual([2]);
})

test("When using metric settings, units are converted correctly", () => {
    const dataConverter = new DataConverter({
        ...DEFAULTS.userSettings,
        precipitation: "mm"
    });

    expect.soft(dataConverter.convert("surface_pressure", [1000])).toBeCloseTo(29.53, 3);
    expect.soft(dataConverter.convert("visibility", [1000 * 2])).toEqual([2]);
})

describe("Other variables remain unchanged", () => {
    test.each([
        "temperature_2m",
        "apparent_temperature",
        "dewpoint_2m",
        "is_day",
        "precipitation",
        "precipitation_probability",
        "relativehumidity_2m",
        "uv_index",
        "weathercode"
    ] as (keyof Omit<Forecast["hourly"], "time">)[])(`When converting %s, the data is unchanged`, (property) => {
        const dataConverter = new DataConverter(DEFAULTS.userSettings);
    
        expect.soft(dataConverter.convert(property, [1, 2, 3])).toEqual([1, 2, 3]);

        const dataConverter2 = new DataConverter({
            ...DEFAULTS.userSettings,
            precipitation: "mm"
        });

        expect.soft(dataConverter2.convert(property, [1, 2, 3])).toEqual([1, 2, 3]);
    })
})