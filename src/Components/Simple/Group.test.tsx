import { render } from "@testing-library/react"

import Group from "./Group"


test("Matches snapshot", () => {
    const { container } = render(<Group />)

    expect(container).toMatchSnapshot()
})