import { forecast, useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import getTimeFormatted from "ts/TimeConversion";

import type { ChartViews } from ".";
import Chart from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const mocks = vi.hoisted(() => ({
    ChartContext: vi.fn(
        ({ children }: { view: ChartViews; day: number; children: React.ReactNode }) => (
            <>
                <p>ChartContext</p>
                {children}
            </>
        )
    ),
    Axes: () => <p>Axes</p>,
    ChartVisualization: () => <p>ChartVisualization</p>,
    NowReference: vi.fn((_: { isShown: boolean }) => <p>NowReference</p>),
    Tooltip: vi.fn((_: { day: number }) => <p>Tooltip</p>),
}));

vi.mock("Components/Modals/Chart/__internal__", () => ({
    ChartContext: mocks.ChartContext,
    Axes: mocks.Axes,
    ChartVisualization: mocks.ChartVisualization,
    NowReference: mocks.NowReference,
    Tooltip: mocks.Tooltip,
}));

test("Doesn't render a modal if isOpen is false", () => {
    render(<Chart isOpen={false} showView="temperature_2m" onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Renders a modal if isOpen is true", () => {
    render(<Chart isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("Calls onClose when the modal is closed", () => {
    const onClose = vi.fn();

    render(<Chart isOpen={true} showView="temperature_2m" onClose={onClose} />);

    act(() => {
        screen.getByRole("dialog").dispatchEvent(new Event("cancel"));
    });

    expect(onClose).toHaveBeenCalledOnce();
});

test("Renders a select with options for each view", () => {
    render(<Chart isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

    const options = screen.getAllByRole("option");
    const expectedValues: Array<ChartViews> = [
        "temperature_2m",
        "relativehumidity_2m",
        "precipitation",
        "dewpoint_2m",
        "visibility",
        "windspeed_10m",
        "surface_pressure",
        "us_aqi",
        "uv_index",
    ];

    expect.soft(options).toHaveLength(9);
    options.forEach((option, i) => expect.soft(option).toHaveValue(expectedValues[i]));
});

test("Renders all the components", () => {
    render(<Chart isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

    expect.soft(screen.queryByText("ChartContext")).toBeInTheDocument();
    expect.soft(screen.queryByText("NowReference")).toBeInTheDocument();
    expect.soft(screen.queryByText("Tooltip")).toBeInTheDocument();
    expect.soft(screen.queryByText("ChartVisualization")).toBeInTheDocument();
    expect.soft(screen.queryByText("Axes")).toBeInTheDocument();
});

describe.each(forecast().daily.time.map((day, i) => [day, i]))("Day %#", (day, i) => {
    test("Renders a toggle button", () => {
        render(<Chart isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

        expect(screen.getByLabelText(getTimeFormatted(day, "weekday"))).toBeInTheDocument();
    });

    test("Toggle button is checked by default if day is passed to showDay. Also shows full date in modal.", () => {
        render(
            <Chart isOpen={true} showView="temperature_2m" onClose={() => undefined} showDay={i} />
        );

        const toggle = screen.getByLabelText<HTMLInputElement>(getTimeFormatted(day, "weekday"));

        expect.soft(toggle).toBeChecked();
        expect.soft(screen.queryByText(getTimeFormatted(day, "date"))).toBeInTheDocument();
    });

    test("Day is passed to children", () => {
        render(
            <Chart isOpen={true} showView="temperature_2m" onClose={() => undefined} showDay={i} />
        );

        expect
            .soft(mocks.ChartContext)
            .toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );
        expect.soft(mocks.NowReference).toHaveBeenLastCalledWith({ isShown: !i }, {});
        expect.soft(mocks.Tooltip).toHaveBeenLastCalledWith({ day: i }, {});
    });

    test("Clicking a toggle button changes the day", () => {
        render(
            <Chart
                isOpen={true}
                showView="temperature_2m"
                onClose={() => undefined}
                //Ensure every day isn't selected by default
                showDay={i === 0 ? 1 : 0}
            />
        );

        expect
            .soft(mocks.ChartContext)
            .not.toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );
        expect.soft(mocks.NowReference).not.toHaveBeenLastCalledWith({ isShown: !i }, {});
        expect.soft(mocks.Tooltip).not.toHaveBeenLastCalledWith({ day: i }, {});

        const toggle = screen.getByLabelText<HTMLInputElement>(getTimeFormatted(day, "weekday"));

        act(() => toggle.click());

        expect.soft(screen.queryByText(getTimeFormatted(day, "date"))).toBeInTheDocument();
        expect
            .soft(mocks.ChartContext)
            .toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );
        expect.soft(mocks.NowReference).toHaveBeenLastCalledWith({ isShown: !i }, {});
        expect.soft(mocks.Tooltip).toHaveBeenLastCalledWith({ day: i }, {});
    });
});

test.each([
    ["temperature_2m", "Temperature"],
    ["relativehumidity_2m", "Humidity"],
    ["precipitation", "Precipitation"],
    ["dewpoint_2m", "Dewpoint"],
    ["visibility", "Visibility"],
    ["windspeed_10m", "Windspeed"],
    ["surface_pressure", "Pressure"],
    ["us_aqi", "Air Quality"],
    ["uv_index", "UV Index"],
] as [ChartViews, string][])("Clicking an option changes the view to %s", async (view, label) => {
    render(
        <Chart
            isOpen={true}
            //Ensure the view isn't selected by default
            showView={view === "temperature_2m" ? "relativehumidity_2m" : "temperature_2m"}
            onClose={() => undefined}
        />
    );

    await act(async () => {
        fireEvent.change(screen.getByRole("combobox"), { target: { value: view } });
        await vi.runOnlyPendingTimersAsync();
    });

    expect.soft(screen.getByRole<HTMLOptionElement>("option", { name: label }).selected).toBe(true);
    expect.soft(mocks.ChartContext).toHaveBeenLastCalledWith(expect.objectContaining({ view }), {});
});
