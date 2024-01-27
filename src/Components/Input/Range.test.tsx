import { render } from "@testing-library/react";

import Range from "./Range"


test("Matches snapshot", () => {
    const { container } = render(
        <Range
            min={0}
            max={100}
            value={50}
            step={1}
        />
    );

    expect(container).toMatchSnapshot();
})