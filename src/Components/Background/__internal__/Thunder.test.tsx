import RTTR from "@react-three/test-renderer";
import { randomLcg } from "d3";
import type { PointLight } from "three";

import type WeatherCondition from "ts/WeatherCondition";

import Thunder from "./Thunder";


beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockImplementation(randomLcg(1));
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.mocked(Math.random).mockRestore();
});

describe("Visibility", () => {
    test.each(["Thunderstorms", "Thunderstorms and Hail"] as WeatherCondition["type"][])(
        "Shows if Condition is %s",
        async condition => {
            const renderer = await RTTR.create(<Thunder condition={condition} />);

            expect(renderer.scene.findByType("PointLight").props.visible).toBe(true);
        }
    );

    test("Doesn't show if condition is not thunderstorms", async () => {
        const renderer = await RTTR.create(<Thunder condition="Clear" />);

        expect(renderer.scene.findByType("PointLight").props.visible).toBe(false);
    });
});

describe("Movement", () => {
    test("Moves positions when power is low and flashing", async () => {
        const renderer = await RTTR.create(<Thunder condition="Thunderstorms" />);
        const light = renderer.scene.findByType("PointLight");

        vi.spyOn(light.instance, "power" as any, "get").mockReturnValue(49);

        await RTTR.act(async () => {
            await vi.advanceTimersByTimeAsync(7500);
        });

        renderer.advanceFrames(1, 0);

        const position = light.instance.position.clone();

        renderer.advanceFrames(1, 0);

        expect(light.instance.position).not.toEqual(position);
    });

    test("While power is higher than limit, position is static", async () => {
        const renderer = await RTTR.create(<Thunder condition="Thunderstorms" />);
        const light = renderer.scene.findByType("PointLight").instance as PointLight;

        vi.spyOn(light, "power", "get").mockReturnValue(50);

        await RTTR.act(async () => {
            await vi.advanceTimersByTimeAsync(7500);
        });

        renderer.advanceFrames(1, 0);

        const position = light.position.clone();

        renderer.advanceFrames(1, 0);

        expect(light.position).toEqual(position);
    });

    test("While not flashing, position is static", async () => {
        const renderer = await RTTR.create(<Thunder condition="Thunderstorms" />);
        const light = renderer.scene.findByType("PointLight");

        renderer.advanceFrames(1, 0);

        const position = light.instance.position.clone();

        renderer.advanceFrames(1, 0);

        expect(light.instance.position).toEqual(position);
    });
});

describe("Flashing", () => {
    test("When flashing, power is set to a random number between 0 and 500", async () => {
        const renderer = await RTTR.create(<Thunder condition="Thunderstorms" />);
        const light = renderer.scene.findByType("PointLight").instance as PointLight;

        await RTTR.act(async () => {
            await vi.advanceTimersByTimeAsync(7500);
        });

        renderer.advanceFrames(1, 0);

        expect.soft(light.power).toBeGreaterThanOrEqual(0);
        expect.soft(light.power).toBeLessThanOrEqual(500);

        //Bound test
        vi.mocked(Math.random).mockReturnValue(0);
        renderer.advanceFrames(1, 0);

        expect.soft(light.power).toBe(0);

        vi.mocked(Math.random).mockReturnValue(1);
        renderer.advanceFrames(1, 0);

        expect.soft(light.power).toBe(500);
    });

    test("When not flashing and light has high power, power is randomly set", async () => {
        const renderer = await RTTR.create(<Thunder condition="Thunderstorms" />);
        const light = renderer.scene.findByType("PointLight").instance as PointLight;

        vi.spyOn(light, "power", "get").mockReturnValueOnce(101);

        renderer.advanceFrames(1, 0);

        const power = light.power;

        renderer.advanceFrames(1, 0);

        expect.soft(light.power).not.toBe(power);
    });
});

test("After 500ms, flashing is disabled", async () => {
    const renderer = await RTTR.create(<Thunder condition="Thunderstorms" />);
    const light = renderer.scene.findByType("PointLight").instance as PointLight;

    await RTTR.act(async () => {
        await vi.advanceTimersByTimeAsync(7500);
    });

    renderer.advanceFrames(1, 0);

    expect.soft(light.power).toBeGreaterThan(0);

    await RTTR.act(async () => {
        vi.spyOn(light, "power", "get").mockReturnValueOnce(100);
        await vi.advanceTimersByTimeAsync(500);
    });

    renderer.advanceFrames(1, 0);

    expect.soft(light.power).toBe(0);
});
