import { render, screen } from "@testing-library/react"

import { Button, InputGroup } from "Components"


test("Matches default snapshot", () => {
    const comp = render(
        <InputGroup>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    )

    expect(comp).toMatchSnapshot()
})

test("Matches uniform snapshot", () => {
    const comp = render(
        <InputGroup isUniform>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    )

    expect(comp).toMatchSnapshot()
})

test("Matches hasGap snapshot", () => {
    const comp = render(
        <InputGroup hasGap>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    )

    expect(comp).toMatchSnapshot()
})

test("Matches hasGap and uniform snapshot", () => {
    const comp = render(
        <InputGroup hasGap isUniform>
            <Button>Test</Button>
            <Button>Test</Button>
            <Button>Test</Button>
        </InputGroup>
    )

    expect(comp).toMatchSnapshot()
})

test("Children using inputBorderRadius are given 0 radius on non-gap", () => {
    render(
        <InputGroup>
            <Button>Test</Button>
        </InputGroup>
    )

    const button = getComputedStyle(screen.getByRole("button"))
    
    expect(button.getPropertyValue("--input-border-radius")).toBe("0")
})