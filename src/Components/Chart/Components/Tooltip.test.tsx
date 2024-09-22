import { fireEvent, render, screen } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";

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
        async (element: SVGGElement, user: UserEvent) => {
            await user.pointer({ target: element, coords: { clientX: 100, clientY: 0}})
        },
        async (element: SVGGElement, user: UserEvent) => {
            await user.unhover(element);
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
    async (_, triggerEvent, endEvent) => {
        const user = userEvent.setup();
        const { container } = render(
            <Chart dataPoints={dataPoints} type="linear">
                <Tooltip>
                    <TestComponent />
                </Tooltip>
            </Chart>
        );

        const graph = container.querySelector("svg")!;
        //Get the last line element (first is a decorative line to separate the graph from the tooltip area)
        const referenceLine = container.querySelector("line:last-of-type")!;

        expect.soft(referenceLine).toHaveStyle("display: none");

        await triggerEvent(graph, user);


        expect.soft(referenceLine).toHaveStyle("display: block");
        expect.soft(container.querySelector("svg div")).toHaveStyle("align-items: center");

        await endEvent(graph, user);

        expect.soft(referenceLine).toHaveStyle("display: none");
        expect.soft(container.querySelector("svg div")).toHaveStyle("align-items: flex-start");
    }
);

test.each(["linear", "bar"] as ChartType[])(
    "%s: Hover passes a hoverIndex based on the mouse position",
    async type => {
        const user = userEvent.setup();
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

        async function testPointer(coords: { clientX: number, clientY: number}, expectedText: string)  {
            await user.pointer({ target: graph, coords });
            expect.soft(screen.queryByText(expectedText)).toBeInTheDocument();
            await user.unhover(graph);
        };

        await testPointer({ clientX: 38, clientY: 0 }, "0");
        await testPointer({ clientX: 22, clientY: 0 }, "8");
        await testPointer({ clientX: 20, clientY: 0 }, "9");
        await testPointer({ clientX: 16, clientY: 0 }, "11");
    }
);

test.todo(
    "Test for positioning of tooltip not possible, requires manual testing (until vitest browser mode to automate?)"
);
