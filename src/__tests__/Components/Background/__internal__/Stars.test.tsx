import RTTR from "@react-three/test-renderer";
import { randomLcg } from "d3";

import { Stars } from "Components/Background/__internal__/";


beforeAll(() => {
    //Replace Math.random with a seeded random number generator by d3.
    //Turns out using it for charts had more benefits than just getting rid of recharts.
    vi.spyOn(Math, "random").mockImplementation(randomLcg(1))
})

afterAll(() => {
    vi.mocked(Math.random).mockRestore()
})


test("Shows if Condition is Clear at night", async () => {
    const renderer = await RTTR.create(<Stars isDay={false} condition="Clear" />)

    expect(
        renderer.scene.findByType("Points").props.visible
    ).toBe(true)
})

test("Doesn't show if Condition is Clear during the day", async () => {
    const renderer = await RTTR.create(<Stars isDay={true} condition="Clear" />)

    expect(
        renderer.scene.findByType("Points").props.visible
    ).toBe(false)
})

test("Matches Snapshot", async () => {
    const renderer = await RTTR.create(<Stars isDay={false} condition="Clear" />)

    expect(renderer.toTree()).toMatchSnapshot()
})