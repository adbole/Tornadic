import { render } from "@testing-library/react";

import { Button } from "Components";


test("Matches default primary snapshot", () => {
    const comp = render(<Button>Test</Button>)

    expect(comp).toMatchSnapshot()
})

test("Matches the transparent snapshot", () => {
    const comp = render(<Button varient="transparent">Test</Button>)

    expect(comp).toMatchSnapshot()
})

test("Matches the text snapshot", () => {
    const comp = render(<Button varient="text">Test</Button>)

    expect(comp).toMatchSnapshot()
})