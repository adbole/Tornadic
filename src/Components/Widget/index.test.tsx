import testIds from "@test-consts/testIDs";

import { render, screen } from "@testing-library/react";

import Widget from ".";

//Widget tests are mostly focused on rendering and style as they are the base of all widgets that
//display actual data throughout the application.

test("renders normally", () => {
    render(<Widget>Test</Widget>);

    expect.soft(screen.queryByText("Test")).toBeInTheDocument();
});

test("passes extra props to the section", () => {
    render(<Widget data-test="test">Test</Widget>);

    expect.soft(screen.getByTestId(testIds.Widget.WidgetSection).dataset["test"]).toBe("test");
});

describe("rendering title and icon", () => {
    test("renders with a title and icon if given both", () => {
        render(
            <Widget widgetTitle="Title" widgetIcon={<span>Icon</span>}>
                Test
            </Widget>
        );

        expect.soft(screen.queryByText("Title")).toBeInTheDocument();
        expect.soft(screen.queryByText("Icon")).toBeInTheDocument();
    });

    test("doesn't render title if icon is missing", () => {
        render(<Widget widgetTitle="Title">Test</Widget>);

        expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });

    test("doesn't render icon if title is missing", () => {
        render(<Widget widgetIcon={<span>Icon</span>}>Test</Widget>);

        expect(screen.queryByText("Icon")).not.toBeInTheDocument();
    });
});

//Widgets are meant to be used in a grid, sizes effect their spans
describe("sizing", () => {
    test("normal", () => {
        render(<Widget>Test</Widget>);

        const widget = screen.getByTestId(testIds.Widget.WidgetSection);
        const style = getComputedStyle(widget);

        expect.soft(style.gridColumn).toBe("");
        expect.soft(style.gridRow).toBe("");
    });

    test("wide", () => {
        render(<Widget size="widget-wide">Test</Widget>);

        const widget = screen.getByTestId(testIds.Widget.WidgetSection);
        const style = getComputedStyle(widget);

        expect.soft(style.gridColumn).toBe("span 2");
        expect.soft(style.gridRow).toBe("");
    });

    test("large", () => {
        render(<Widget size="widget-large">Test</Widget>);

        const widget = screen.getByTestId(testIds.Widget.WidgetSection);
        const style = getComputedStyle(widget);

        expect.soft(style.gridColumn).toBe("span 2");
        expect.soft(style.gridRow).toBe("span 2");
    });
});

describe("template widget", () => {
    test("if isTemplate is true, then children don't get flex: 1", () => {
        render(<Widget isTemplate>Test</Widget>);

        const widget = screen.getByTestId(testIds.Widget.WidgetSection);
        const result = [...widget.children].every(child => getComputedStyle(child).flex === "");

        expect.soft(result).toBeTruthy();
    });

    test("if isTemplate is false, then children (excluding title) get flex: 1", () => {
        render(
            <Widget widgetTitle="Title" widgetIcon={<span>Icon</span>}>
                Test
            </Widget>
        );

        const widget = screen.getByTestId(testIds.Widget.WidgetSection);
        const title = getComputedStyle(widget.children[0]);
        const others = [...widget.children]
            .slice(1)
            .every(child => getComputedStyle(child).flex === "1");

        expect.soft(title.flex).toBe("");
        expect.soft(others).toBeTruthy();
    });
});

describe("onClick", () => {
    test("If onClick is given, then the cursor is set to pointer", () => {
        render(<Widget onClick={() => undefined}>Test</Widget>);

        expect(screen.queryByTestId(testIds.Widget.WidgetSection)).toHaveStyle({ cursor: "pointer" });
    });

    test("If onClick is not given, then the cursor is set to pointer", () => {
        render(<Widget>Test</Widget>);

        expect(screen.queryByTestId(testIds.Widget.WidgetSection)).not.toHaveStyle({ cursor: "pointer" });
    })
})