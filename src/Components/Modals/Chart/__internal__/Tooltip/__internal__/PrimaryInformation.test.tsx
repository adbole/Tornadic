import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";

import type { ChartViews } from "Components/Modals/Chart";
import { ChartContext } from "Components/Modals/Chart/__internal__";

import { trunc } from "ts/Helpers";

import * as TooltipHelpers from "./Helpers";
import { PrimaryInformation } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));
vi.spyOn(TooltipHelpers, "getLowHigh");

describe.each([
    "dewpoint_2m",
    "precipitation",
    "relativehumidity_2m",
    "surface_pressure",
    "temperature_2m",
    "us_aqi",
    "uv_index",
    "visibility",
    "windspeed_10m",
] as Array<ChartViews>)("Given view %s", view => {
    test("When given hoverIndex -1 and day 0, mainInformation is current value", () => {
        const weather = useWeather().weather;
        const value = trunc(weather.getForecast(view));
        const unit = weather.getForecastUnit(view);

        render(
            <ChartContext view={view} day={0}>
                <PrimaryInformation day={0} hoverIndex={-1} />
            </ChartContext>
        );

        expect(screen.getByText(`${value}${unit}`)).toBeInTheDocument();
    });

    test("Day > 0 and hoverIndex = -1 uses getLowHigh", () => {
        render(
            <ChartContext view={view} day={1}>
                <PrimaryInformation day={1} hoverIndex={-1} />
            </ChartContext>
        );

        expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledOnce();
        expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledWith(expect.anything(), view, 1);
    });

    test("HoverIndex > -1", () => {
        const weather = useWeather().weather;
        const value = trunc(weather.getForecast(view, 1));
        const unit = weather.getForecastUnit(view);

        render(
            <ChartContext view={view} day={0}>
                <PrimaryInformation day={0} hoverIndex={1} />
            </ChartContext>
        );

        expect(screen.getByText(`${value}${unit}`)).toBeInTheDocument();
    });
});
