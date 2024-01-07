import { render } from "@testing-library/react";

import { Button } from "Components";


test("Matches default primary snapshot", () => {
    const { container } = render(<Button>Test</Button>);

    expect(container).toMatchSnapshot();
});

test("Matches the transparent snapshot", () => {
    const { container } = render(<Button varient="transparent">Test</Button>);

    expect(container).toMatchSnapshot();
});
