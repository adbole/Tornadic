import RTTR from "@react-three/test-renderer";

import type WeatherCondition from "ts/WeatherCondition";

import Clouds from "./Clouds";


const mocks = vi.hoisted(() => ({
    DreiCloud: vi.fn(),
}));

vi.mock("@react-three/drei", async importOriginal => ({
    ...((await importOriginal()) as any),
    Cloud: mocks.DreiCloud,
}));

test.each([
    ["day", true],
    ["night", false],
])("Doesn't show if Condition is Clear at %s", async (_, isDay) => {
    const renderer = await RTTR.create(<Clouds isDay={isDay} condition="Clear" />);

    expect(renderer.scene.findByType("Group").props.visible).toBe(false);
});

test.each([
    ["day", true, 4],
    ["night", false, 0.2],
])("Ambient light has intensity %s at %s", async (_, isDay, intensity) => {
    const renderer = await RTTR.create(<Clouds isDay={isDay} condition="Clear" />);

    expect(renderer.scene.findByType("AmbientLight").props.intensity).toBe(intensity);
});

const commonProps = {
    seed: 1,
    position: [0, 10, -10],
    growth: 5,
    speed: 0.2,
    bounds: [30, 1, 1],
};

describe.each([
    ["Day", true],
    ["Night", false],
])("%s Conditions", async (_, isDay) => {
    describe("Heavy", () => {
        test.each([
            "Overcast",
            "Rain",
            "Freezing Rain",
            "Snow",
            "Snow Grains",
            "Thunderstorms",
            "Thunderstorms and Hail",
        ] as WeatherCondition["type"][])(`%s`, async condition => {
            const renderer = await RTTR.create(<Clouds isDay={isDay} condition={condition} />);

            expect.soft(renderer.scene.findByType("Group").props.visible).toBe(true);

            expect.soft(mocks.DreiCloud).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...commonProps,
                    segments: 200,
                    opacity: 1,
                }),
                expect.anything()
            );
        });
    });

    describe("Medium", () => {
        test.each(["Rain Showers", "Snow Showers", "Partly Cloudy"] as WeatherCondition["type"][])(
            `%s`,
            async condition => {
                const renderer = await RTTR.create(<Clouds isDay={isDay} condition={condition} />);

                expect.soft(renderer.scene.findByType("Group").props.visible).toBe(true);

                expect.soft(mocks.DreiCloud).toHaveBeenCalledWith(
                    expect.objectContaining({
                        ...commonProps,
                        segments: 100,
                        opacity: 0.4,
                    }),
                    expect.anything()
                );
            }
        );
    });

    describe("Light", () => {
        test.each([
            "Drizzle",
            "Foggy",
            "Freezing Drizzle",
            "Mostly Clear",
        ] as WeatherCondition["type"][])(`%s`, async condition => {
            const renderer = await RTTR.create(<Clouds isDay={isDay} condition={condition} />);

            expect.soft(renderer.scene.findByType("Group").props.visible).toBe(true);

            expect.soft(mocks.DreiCloud).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...commonProps,
                    segments: 50,
                    opacity: 0.25,
                }),
                expect.anything()
            );
        });
    });
});
