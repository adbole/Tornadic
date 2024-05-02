import { forecast, useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import getTimeFormatted from "ts/TimeConversion";

import ChartModal from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const mocks = vi.hoisted(() => ({
    Standard: vi.fn((_: { view: ChartViews; day: number }) => <p>Standard Chart View</p>),
    Ensemble: vi.fn((_: { view: ChartViews; day: number }) => <p>Ensemble Chart View</p>),
}));

vi.mock("Components/Chart/Variants", () => ({
    Standard: mocks.Standard,
    Ensemble: mocks.Ensemble,
}));

test("Doesn't render a modal if isOpen is false", () => {
    render(<ChartModal isOpen={false} showView="temperature_2m" onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Renders a modal if isOpen is true", () => {
    render(<ChartModal isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("Calls onClose when the modal is closed", () => {
    const onClose = vi.fn();

    render(<ChartModal isOpen={true} showView="temperature_2m" onClose={onClose} />);

    act(() => {
        screen.getByRole("dialog").dispatchEvent(new Event("cancel"));
    });

    expect(onClose).toHaveBeenCalledOnce();
});

test("Renders a select with options for each view", () => {
    render(<ChartModal isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

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
        "cape",
    ];

    expect.soft(options).toHaveLength(10);
    options.forEach((option, i) => expect.soft(option).toHaveValue(expectedValues[i]));
});

test("Renders all the components", () => {
    render(<ChartModal isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

    expect.soft(screen.queryByText("Standard Chart View")).toBeInTheDocument();
});

test("Switches between Standard and Ensemble views", () => {
    render(<ChartModal isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

    expect.soft(screen.queryByText("Ensemble Chart View")).not.toBeInTheDocument();

    act(() => {
        screen.getByTitle(/Ensemble/).click();
    });

    expect.soft(screen.queryByText("Ensemble Chart View")).toBeInTheDocument();
    expect.soft(screen.queryByText("Standard Chart View")).not.toBeInTheDocument();
});

describe.each(forecast().daily.time.map((day, i) => [day, i]))("Day %#", (day, i) => {
    test("Renders a toggle button", () => {
        render(<ChartModal isOpen={true} showView="temperature_2m" onClose={() => undefined} />);

        expect(screen.getByLabelText(getTimeFormatted(day, "weekday"))).toBeInTheDocument();
    });

    test("Toggle button is checked by default if day is passed to showDay. Also shows full date in modal.", () => {
        render(
            <ChartModal
                isOpen={true}
                showView="temperature_2m"
                onClose={() => undefined}
                showDay={i}
            />
        );

        const toggle = screen.getByLabelText<HTMLInputElement>(getTimeFormatted(day, "weekday"));

        expect.soft(toggle).toBeChecked();
        expect.soft(screen.queryByText(getTimeFormatted(day, "date"))).toBeInTheDocument();
    });

    //Ensures both Ensemble and Standard charts are passed the correct props
    test("Day is passed to children", () => {
        render(
            <ChartModal
                isOpen={true}
                showView="temperature_2m"
                onClose={() => undefined}
                showDay={i}
            />
        );

        expect
            .soft(mocks.Standard)
            .toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );

        act(() => {
            screen.getByTitle(/Ensemble/).click();
        });

        expect
            .soft(mocks.Ensemble)
            .toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );
    });

    test("Clicking a toggle button changes the day", () => {
        render(
            <ChartModal
                isOpen={true}
                showView="temperature_2m"
                onClose={() => undefined}
                //Ensure every day isn't selected by default
                showDay={i === 0 ? 1 : 0}
            />
        );

        expect
            .soft(mocks.Standard)
            .not.toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );

        const toggle = screen.getByLabelText<HTMLInputElement>(getTimeFormatted(day, "weekday"));

        act(() => toggle.click());

        expect.soft(screen.queryByText(getTimeFormatted(day, "date"))).toBeInTheDocument();
        expect
            .soft(mocks.Standard)
            .toHaveBeenLastCalledWith(
                expect.objectContaining({ view: "temperature_2m", day: i }),
                {}
            );
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
    ["cape", "CAPE"],
] as [ChartViews, string][])("Clicking an option changes the view to %s", async (view, label) => {
    render(
        <ChartModal
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
    expect.soft(mocks.Standard).toHaveBeenLastCalledWith(expect.objectContaining({ view }), {});
});
