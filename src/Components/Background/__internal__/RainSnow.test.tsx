import RTTR from "@react-three/test-renderer"
import type { TypedArray } from "three";

import type WeatherCondition from "ts/WeatherCondition";

import RainSnow from "./RainSnow";


describe("Not Visible", () => {
    test.each([
        "Clear",
        "Mostly Clear",
        "Partly Cloudy",
        "Overcast",
        "Foggy"
    ] as WeatherCondition["type"][])("%s", async (condition) => {
        const renderer = await RTTR.create(<RainSnow condition={condition} />)

        expect(
            renderer.scene.findByType("Points").props.visible
        ).toBe(false)
    })
})

describe("Amount of Rain/Snow", () => {
    test.each([
        ["Rain Showers", 500],
        ["Snow Showers", 500],
        ["Drizzle", 250],
        ["Freezing Drizzle", 250],
        ["Thunderstorms", 1000],
        ["Thunderstorms and Hail", 1000],
        ["Snow", 1000],
        ["Snow Grains", 1000],
        ["Rain", 1000],
        ["Freezing Rain", 1000],
    ] as [WeatherCondition["type"], number][])("%s", async (condition, amount) => {
        const renderer = await RTTR.create(<RainSnow condition={condition} />)

        expect(
            renderer.scene.findByType("Points").props.geometry.attributes.position.count
        ).toBe(amount)
    })
})

//A single point is set to go over the edge to test wrapping.
describe("Size and speed of Rain/Snow", () => {
    beforeAll(() => {
        vi.spyOn(Math, "random").mockReturnValue(0.35)
    })

    afterAll(() => {
        vi.mocked(Math.random).mockRestore()
    })

    test.each([
        ["Snow", 0.5, 10],
        ["Snow Grains", 0.5, 10],
        ["Snow Showers", 0.5, 10],
        ["Rain", 0.3, 50],
        ["Freezing Rain", 0.3, 50],
        ["Rain Showers", 0.3, 50],
        ["Drizzle", 0.3, 50],
        ["Freezing Drizzle", 0.3, 50],
        ["Thunderstorms", 0.3, 50],
        ["Thunderstorms and Hail", 0.3, 50],
    ] as [WeatherCondition["type"], number, number][])("%s", async (condition, size, speed) => {
        const renderer = await RTTR.create(<RainSnow condition={condition} />)

        expect.soft(
            renderer.scene.findByType("Points").props.material.size
        ).toBe(size)

        const points = renderer.scene.findByType("Points").props.geometry.attributes.position.array as TypedArray
        //Set a point to go over edge
        points[1] = -250

        const delta = 0.5

        const expectedPoints = [...points]
        for(let i = 1; i < expectedPoints.length; i += 3) {
            expectedPoints[i] -= speed * delta

            if(expectedPoints[i] < -250) {
                expectedPoints[i] = 250
            }
        }

        renderer.advanceFrames(1, delta)

        expect.soft([...points]).toEqual(expectedPoints)
    })
})

test("If the delta is greater than 1, the points should not move", async () => {
    const renderer = await RTTR.create(<RainSnow condition="Rain" />)

    const points = renderer.scene.findByType("Points").props.geometry.attributes.position.array as TypedArray

    const expectedPoints = [...points]

    renderer.advanceFrames(1, 2)

    expect([...points]).toEqual([...expectedPoints])
})