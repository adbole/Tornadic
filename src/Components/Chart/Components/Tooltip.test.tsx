import { act, fireEvent, render, screen } from "@testing-library/react";

import type { ChartType } from "../";
import Chart from "../";

import { Tooltip, useTooltip } from ".";



function TestComponent() {
    const hoverIndex = useTooltip();

    return <div>{hoverIndex}</div>;
}

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [i],
}));

test.each([0, 1])("No hover passes hoverindex -1", day => {
    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Tooltip>
                <TestComponent />
            </Tooltip>
        </Chart>
    );

    expect(screen.queryByText("-1")).toBeInTheDocument();
});

test.each([
    [
        "onMouseEnter, onMouseLeave",
        (element: SVGGElement) => {
            fireEvent.mouseEnter(element);
            fireEvent.mouseMove(element, { clientX: 100, clientY: 0 });
        },
        (element: SVGGElement) => {
            fireEvent.mouseLeave(element);
        },
    ],
    [
        "onTouchStart, onTouchEnd",
        (element: SVGGElement) => {
            fireEvent.touchStart(element);
            fireEvent.touchMove(element, { touches: [{ clientX: 100, clientY: 0 }] });
        },
        (element: SVGGElement) => {
            fireEvent.touchEnd(element);
        },
    ],
])(
    `%s causes the reference line to set its display and div to change item positions`,
    (_, triggerEvent, endEvent) => {
        const { container } = render(
            <Chart dataPoints={dataPoints} type="linear">
                <Tooltip>
                    <TestComponent />
                </Tooltip>
            </Chart>
        );

        const graph = container.querySelector("svg")!;
        const referenceLine = container.querySelector("line")!;

        expect.soft(referenceLine).toHaveStyle("display: none");

        act(() => {
            triggerEvent(graph);
        });

        expect.soft(referenceLine).toHaveStyle("display: block");
        expect.soft(container.querySelector("svg div")).toHaveStyle("align-items: center");

        act(() => {
            endEvent(graph);
        });

        expect.soft(referenceLine).toHaveStyle("display: none");
        expect.soft(container.querySelector("svg div")).toHaveStyle("align-items: flex-start");
    }
);

test.each(["linear", "bar"] as ChartType[])(
    "%s: Hover passes a hoverIndex based on the mouse position",
    type => {
        const { container } = render(
            <Chart dataPoints={dataPoints} type={type}>
                <Tooltip>
                    <TestComponent />
                </Tooltip>
            </Chart>
        );

        const graph = container.querySelector("svg")!;

        //Jest DOM makes it very hard to do this nicely
        // Generally, +2 in X decreases while -2 in X increases
        //38 is observed as 0

        act(() => {
            fireEvent.mouseEnter(graph);
            fireEvent.mouseMove(graph, { clientX: 38, clientY: 0 });
        });

        expect(screen.queryByText("0")).toBeInTheDocument();

        act(() => {
            fireEvent.mouseEnter(graph);
            fireEvent.mouseMove(graph, { clientX: 22, clientY: 0 });
        });

        expect(screen.queryByText("8")).toBeInTheDocument();

        act(() => {
            fireEvent.mouseEnter(graph);
            fireEvent.mouseMove(graph, { clientX: 20, clientY: 0 });
        });

        expect(screen.queryByText("9")).toBeInTheDocument();


        act(() => {
            fireEvent.mouseEnter(graph);
            fireEvent.mouseMove(graph, { clientX: 16, clientY: 0 });
        });

        expect(screen.queryByText("11")).toBeInTheDocument();
    }
);

test.todo(
    "Test for positioning of tooltip not possible, requires manual testing (until vitest browser mode to automate?)"
);
