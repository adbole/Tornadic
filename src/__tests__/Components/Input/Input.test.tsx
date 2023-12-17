import { render } from "@testing-library/react";

import { Input } from "Components";


test("Matches snapshot", () => {
    const { container } = render(<Input />)

    expect(container).toMatchSnapshot()
})