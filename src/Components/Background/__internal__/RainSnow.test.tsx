import RTTR from "@react-three/test-renderer";
import type { TypedArray } from "three";

import type WeatherCondition from "ts/WeatherCondition";

import RainSnow from "./RainSnow";
import useViewport from "./useViewport";


const mocks = vi.hoisted(() => ({
    width: 1000,
    height: 1000,
}))

vi.mock("./useViewport", () => ({
    default: vi.fn(() => ({ width: mocks.width, height: mocks.height })),
}))

describe("Not Visible", () => {
    test.each([
        "Clear",
        "Mostly Clear",
        "Partly Cloudy",
        "Overcast",
        "Foggy",
    ] as WeatherCondition["type"][])("%s", async condition => {
        const renderer = await RTTR.create(<RainSnow condition={condition} />);

        expect(renderer.scene.findByType("Points").props.visible).toBe(false);
    });
});


describe("Amount of Rain/Snow", () => {
    const [high, med, low] = [300, 150, 75];

    describe.each([
        ["Rain Showers", med],
        ["Snow Showers", med],
        ["Drizzle", low],
        ["Freezing Drizzle", low],
        ["Thunderstorms", high],
        ["Thunderstorms and Hail", high],
        ["Snow", high],
        ["Snow Grains", high],
        ["Rain", high],
        ["Freezing Rain", high],
    ] as [WeatherCondition["type"], number][])("%s", async (condition, amount) => {
        test("1:1 Aspect Ratio", async () => {
            vi.mocked(useViewport).mockReturnValue({ width: mocks.width, height: mocks.height });

            const renderer = await RTTR.create(<RainSnow condition={condition} />);

            expect(renderer.scene.findByType("Points").props.geometry.attributes.position.count).toBe(
                amount
            );
        })

        test("Non 1:1 Aspect Ratio", async () => {
            const width = 2000;
            const height = 1000;

            vi.mocked(useViewport).mockReturnValue({ width, height });

            const renderer = await RTTR.create(<RainSnow condition={condition} />);

            expect(renderer.scene.findByType("Points").props.geometry.attributes.position.count).toBe(
                amount * (width / height)
            );
        })
    });
});

//A single point is set to go over the edge to test wrapping.
describe("Size and speed of Rain/Snow", () => {
    beforeAll(() => {
        vi.spyOn(Math, "random").mockReturnValue(0.35);
    });

    afterAll(() => {
        vi.mocked(Math.random).mockRestore();
    });

    const [snowSize, snowSpeed] = [0.75, 10];
    const [rainSize, rainSpeed] = [0.3, 40];

    test.each([
        ["Snow", snowSize, snowSpeed],
        ["Snow Grains", snowSize, snowSpeed],
        ["Snow Showers", snowSize, snowSpeed],
        ["Rain", rainSize, rainSpeed],
        ["Freezing Rain", rainSize, rainSpeed],
        ["Rain Showers", rainSize, rainSpeed],
        ["Drizzle", rainSize, rainSpeed],
        ["Freezing Drizzle", rainSize, rainSpeed],
        ["Thunderstorms", rainSize, rainSpeed],
        ["Thunderstorms and Hail", rainSize, rainSpeed],
    ] as [WeatherCondition["type"], number, number][])("%s", async (condition, size, speed) => {
        const renderer = await RTTR.create(<RainSnow condition={condition} />);

        expect.soft(renderer.scene.findByType("PointsMaterial").props.size).toBe(size);

        const points = renderer.scene.findByType("Points").props.geometry.attributes.position
            .array as TypedArray;
        //Set a point to go over edge
        points[1] = -mocks.height;

        const delta = 0.5;

        const expectedPoints = [...points];
        for (let i = 1; i < expectedPoints.length; i += 3) {
            expectedPoints[i] -= speed * delta;

            if (expectedPoints[i] < -mocks.height) {
                expectedPoints[i] = mocks.height;
            }
        }

        renderer.advanceFrames(1, delta);

        expect.soft([...points]).toEqual(expectedPoints);
    });
});

test("If the delta is greater than 1, the points should not move", async () => {
    const renderer = await RTTR.create(<RainSnow condition="Rain" />);

    const points = renderer.scene.findByType("Points").props.geometry.attributes.position
        .array as TypedArray;

    const expectedPoints = [...points];

    renderer.advanceFrames(1, 2);

    expect([...points]).toEqual([...expectedPoints]);
});
