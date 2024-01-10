import { render } from "@testing-library/react";

import { Gradient } from "Components/Background/__internal__";

import type WeatherCondition from "ts/WeatherCondition";


const mocks = vi.hoisted(() => ({
    Global: vi.fn(),
}))

vi.mock("@emotion/react", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Global: mocks.Global,
}))

describe.each([
    ["Day", true],
    ["Night", false],
])("%s", (_, isDay) => {
    test.each([
        "Clear",
        "Drizzle",
        "Foggy",
        "Freezing Drizzle",
        "Freezing Rain",
        "Mostly Clear",
        "Overcast",
        "Partly Cloudy",
        "Rain",
        "Rain Showers",
        "Snow",
        "Snow Grains",
        "Snow Showers",
        "Thunderstorms",
        "Thunderstorms and Hail"
    ] as WeatherCondition["type"][])("%s", (condition) => {
        render(
            <Gradient isDay={isDay} condition={condition} />
        )

        expect(mocks.Global.mock.lastCall[0].styles.styles).toMatchSnapshot()
    })
})