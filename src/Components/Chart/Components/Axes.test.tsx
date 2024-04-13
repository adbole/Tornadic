import testIds from "@test-consts/testIDs";
import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";

import Chart from "../";

import { Axes } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [i, i * 2],
}));

//The following testa will break if changes relating to scales are made.
//For example, changing the domain of the scales will break the tests

test("renders the x and y axis with a grid", () => {
    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Axes />
        </Chart>
    );

    const xTicks = screen.getByTestId(testIds.Chart.Axes_X).querySelectorAll(".tick");
    const yTicks = screen.getByTestId(testIds.Chart.Axes_Y).querySelectorAll(".tick");
    const xGrid = screen.getByTestId(testIds.Chart.Axes_X_Grid).querySelectorAll(".tick");
    const yGrid = screen.getByTestId(testIds.Chart.Axes_Y_Grid).querySelectorAll(".tick");

    expect.soft(xTicks).toHaveLength(5);
    expect.soft(yTicks).toHaveLength(7);
    expect.soft(xGrid).toHaveLength(12);
    expect.soft(yGrid).toHaveLength(7);
});

test("renders the x and y axis with a grid when type is band", () => {
    render(
        <Chart dataPoints={dataPoints} type="band">
            <Axes />
        </Chart>
    );

    const xTicks = screen.getByTestId(testIds.Chart.Axes_X).querySelectorAll(".tick");
    const yTicks = screen.getByTestId(testIds.Chart.Axes_Y).querySelectorAll(".tick");
    const xGrid = screen.getByTestId(testIds.Chart.Axes_X_Grid).querySelectorAll(".tick");
    const yGrid = screen.getByTestId(testIds.Chart.Axes_Y_Grid).querySelectorAll(".tick");

    expect.soft(xTicks).toHaveLength(4);
    expect.soft(yTicks).toHaveLength(7);
    expect.soft(xGrid).toHaveLength(24);
    expect.soft(yGrid).toHaveLength(7);
});
