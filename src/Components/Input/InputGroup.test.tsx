import { render, screen } from "@testing-library/react";

import { Button, InputGroup } from ".";


test("Matches default snapshot", () => {
    const { container } = render(
        <InputGroup>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    );

    expect(container).toMatchSnapshot();
});

test("Matches uniform snapshot", () => {
    const { container } = render(
        <InputGroup isUniform>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    );

    expect(container).toMatchSnapshot();
});

test("Matches hasGap snapshot", () => {
    const { container } = render(
        <InputGroup hasGap>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    );

    expect(container).toMatchSnapshot();
});

test("Matches hasGap and uniform snapshot", () => {
    const { container } = render(
        <InputGroup hasGap isUniform>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    );

    expect(container).toMatchSnapshot();
});

test("Children using inputBorderRadius are given 0 radius on non-gap", () => {
    render(
        <InputGroup>
            <Button>Test</Button>
        </InputGroup>
    );

    const button = getComputedStyle(screen.getByRole("button"));

    expect(button.getPropertyValue("--input-border-radius")).toBe("0");
});
