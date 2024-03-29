import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import type { ChartViews } from "Components/Modals/Chart";

import { ChartContext } from "../";

import Tooltip from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

type TooltipInternalProps = {
    day: number;
    hoverIndex: number;
};

const mocks = vi.hoisted(() => {
    const mock = (_: TooltipInternalProps) => <></>;

    return {
        primary: vi.fn(mock),
        secondary: vi.fn(mock),
        time: vi.fn(mock),
    };
});

vi.mock("Components/Modals/Chart/__internal__/Tooltip/__internal__", () => ({
    PrimaryInformation: mocks.primary,
    SecondaryInformation: mocks.secondary,
    Time: mocks.time,
}));

test.each([0, 1])("No hover passes hoverindex -1 and day %i", day => {
    render(
        <ChartContext view="temperature_2m" day={day}>
            <Tooltip day={day} />
        </ChartContext>
    );

    const obj = expect.objectContaining({ day, hoverIndex: -1 } as TooltipInternalProps);
    expect.soft(mocks.primary).toHaveBeenLastCalledWith(obj, {});
    expect.soft(mocks.secondary).toHaveBeenLastCalledWith(obj, {});
    expect.soft(mocks.time).toHaveBeenLastCalledWith(obj, {});
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
            <ChartContext view="temperature_2m" day={0}>
                <Tooltip day={0} />
            </ChartContext>
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

test.each(["temperature_2m", "precipitation"] as ChartViews[])(
    "%s: Hover passes a hoverIndex based on the mouse position",
    view => {
        const { container } = render(
            <ChartContext view={view} day={0}>
                <Tooltip day={0} />
            </ChartContext>
        );

        const graph = container.querySelector("svg")!;

        act(() => {
            fireEvent.mouseEnter(graph);
            fireEvent.mouseMove(graph, { clientX: 20, clientY: 0 });
        });

        const obj = expect.objectContaining({ day: 0, hoverIndex: -1 } as TooltipInternalProps);
        expect.soft(mocks.primary).not.toHaveBeenLastCalledWith(obj, {});
        expect.soft(mocks.secondary).not.toHaveBeenLastCalledWith(obj, {});
        expect.soft(mocks.time).not.toHaveBeenLastCalledWith(obj, {});

        const lastCall = mocks.primary.mock.lastCall;

        act(() => {
            fireEvent.mouseEnter(graph);
            fireEvent.mouseMove(graph, { clientX: 30, clientY: 0 });
        });

        expect.soft(mocks.primary).not.toHaveBeenLastCalledWith(lastCall);
        expect.soft(mocks.secondary).not.toHaveBeenLastCalledWith(lastCall);
        expect.soft(mocks.time).not.toHaveBeenLastCalledWith(lastCall);
    }
);

test("If no data exists for a view on a day, then 'No Data' is displayed", () => {
    render(
        <ChartContext view="us_aqi" day={6}>
            <Tooltip day={6} />
        </ChartContext>
    );

    expect(screen.getByText("No Data")).toBeInTheDocument();
});

test.todo(
    "Test for positioning of tooltip not possible, requires manual testing (until vitest browser mode to automate?)"
);
