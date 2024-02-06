import testIds from "@test-consts/testIDs";
import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";

import { Axes, ChartContext } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

test("renders the x and y axis with a grid", () => {
    render(
        <ChartContext view="temperature_2m" day={0}>
            <Axes />
        </ChartContext>
    );

    const xTicks = screen.getByTestId(testIds.Chart.Axes_X).querySelectorAll(".tick");
    const yTicks = screen.getByTestId(testIds.Chart.Axes_Y).querySelectorAll(".tick");
    const xGrid = screen.getByTestId(testIds.Chart.Axes_X_Grid).querySelectorAll(".tick");
    const yGrid = screen.getByTestId(testIds.Chart.Axes_Y_Grid).querySelectorAll(".tick");

    expect.soft(xTicks).toHaveLength(4);
    expect.soft(yTicks).toHaveLength(7);
    expect.soft(xGrid).toHaveLength(8);
    expect.soft(yGrid).toHaveLength(7);
});

test("renders the x and y axis with a grid with d3.ScaleBand", () => {
    render(
        <ChartContext view="precipitation" day={0}>
            <Axes />
        </ChartContext>
    );

    const xTicks = screen.getByTestId(testIds.Chart.Axes_X).querySelectorAll(".tick");
    const yTicks = screen.getByTestId(testIds.Chart.Axes_Y).querySelectorAll(".tick");
    const xGrid = screen.getByTestId(testIds.Chart.Axes_X_Grid).querySelectorAll(".tick");
    const yGrid = screen.getByTestId(testIds.Chart.Axes_Y_Grid).querySelectorAll(".tick");

    expect.soft(xTicks).toHaveLength(4);
    expect.soft(yTicks).toHaveLength(5);
    expect.soft(xGrid).toHaveLength(24);
    expect.soft(yGrid).toHaveLength(5);
});
