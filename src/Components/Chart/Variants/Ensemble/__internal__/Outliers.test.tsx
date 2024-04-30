import { render } from "@testing-library/react";
import { quantile } from "d3"

import type { DataPoint } from "Components/Chart";
import Chart from "Components/Chart"

import { Outliers } from ".";


vi.mock("d3", async (importOriginal) => ({
    ...await importOriginal<any>(),
    quantile: vi.fn()
}))

function constructDataPoints(value: number) {
    return Array.from({ length: 24 }, (_, i) => ({
        x: new Date(i),
        //First three values should be sclied out by Outliers
        //Only the last value should be considered
        y: [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY, value],
    } as DataPoint))
}

test("The first and third quantiles are used", () => {
    const dataPoints = constructDataPoints(0)

    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Outliers />
        </Chart>
    )

    expect.soft(quantile).toHaveBeenCalledWith(expect.any(Array), 0.25)
    expect.soft(quantile).toHaveBeenCalledWith(expect.any(Array), 0.75)
})


test("Values above the Third + 1.5 * IQR are highlighted", async () => {
    //There is no specific reason for why the values here were chosen outside of
    //being chosen to keep the value positive and easy to test with
    vi.mocked(quantile).mockImplementation((_, p) => p === 0.25 ? 0 : 1)
    //IQR = (1 - 0) * 1.5 = 1 * 1.5 = 1.5 | Third + IQR = 2.5

    const dataPoints = constructDataPoints(3)

    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Outliers />
        </Chart>
    )

    expect(document.querySelectorAll("circle").length).toBe(24)
})

test("Values below the First - 1.5 * IQR are highlighted", async () => {
    //There is no specific reason for why the values here were chosen outside of
    //being chosen to keep the value positive and easy to test with
    vi.mocked(quantile).mockImplementation((_, p) => p === 0.25 ? 3 : 2)
    //IQR = (3 - 2) * 1.5 = 1 * 1.5 = 1.5 | First - IQR = 0.5

    const dataPoints = constructDataPoints(0)

    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Outliers />
        </Chart>
    )

    expect(document.querySelectorAll("circle").length).toBe(24)
})

test("Values not beyond the 1.5 * IQR rule aren't highlighted", async () => {
    //There is no specific reason for why the values here were chosen outside of
    //being chosen to keep the value positive and easy to test with
    vi.mocked(quantile).mockImplementation((_, p) => p === 0.25 ? 0 : 1)
    //IQR = (1 - 0) * 1.5 = 1 * 1.5 = 1.5 | Third + IQR = 2.5 | First - IQR = -1.5

    const dataPoints = constructDataPoints(0)

    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Outliers />
        </Chart>
    )

    expect(document.querySelectorAll("circle").length).toBe(0)
})