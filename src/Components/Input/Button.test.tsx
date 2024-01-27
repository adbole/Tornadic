import { render } from "@testing-library/react";

import Button from "./Button";


test("Matches default primary snapshot", () => {
    const { container } = render(<Button>Test</Button>);

    expect(container).toMatchSnapshot();
});

test("Matches the secondary snapshot", () => {
    const { container } = render(<Button varient="secondary">Test</Button>);

    expect(container).toMatchSnapshot();
});


test("Matches the transparent snapshot", () => {
    const { container } = render(<Button varient="transparent">Test</Button>);

    expect(container).toMatchSnapshot();
});
