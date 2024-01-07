import testIds from "__tests__/__constants__/testIDs";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import { Axes, ChartContext } from "Components/Modals/Chart/__internal__";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);

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
    expect.soft(yTicks).toHaveLength(6);
    expect.soft(xGrid).toHaveLength(24);
    expect.soft(yGrid).toHaveLength(6);
});
