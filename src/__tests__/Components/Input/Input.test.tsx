import { render } from "@testing-library/react";

import { Input } from "Components";


test("Matches snapshot", () => {
    const comp = render(<Input />)

    expect(comp).toMatchSnapshot()
})