import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import type { ChartViews } from "Components/Modals/Chart";
import { ChartContext } from "Components/Modals/Chart/__internal__";
import { SecondaryInformation } from "Components/Modals/Chart/__internal__/Tooltip/__internal__";
import * as TooltipHelpers from "Components/Modals/Chart/__internal__/Tooltip/__internal__/Helpers";

import * as Helpers from "ts/Helpers";
import type { CombinedHourly } from "ts/Weather";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);
vi.spyOn(TooltipHelpers, "getLowHigh");


test("When given a property that doesn't have secondaryInformation provided, returns null", () => {
    const { container } = render(
        <ChartContext view="visibility" day={0}>
            <SecondaryInformation day={0} hoverIndex={-1} />
        </ChartContext>
    );

    expect(container.querySelector("svg")).toBeEmptyDOMElement();
});

describe.each([
    ["us_aqi", Helpers.get_aq],
    ["uv_index", Helpers.get_uv],
] as [ChartViews, Function][])("Given view %s", (view, fn) => {
    beforeAll(() => {
        vi.spyOn(Helpers, fn.name as any);
    });

    test(`Uses ${fn.name} for secondaryInformation on day 0`, () => {
        render(
            <ChartContext view={view} day={0}>
                <SecondaryInformation day={0} hoverIndex={-1} />
            </ChartContext>
        );

        expect(Helpers[fn.name as keyof typeof Helpers]).toHaveBeenCalledOnce();
    });

    test(`Uses ${fn.name} for secondaryInformation on hoverIndex != -1`, () => {
        render(
            <ChartContext view={view} day={0}>
                <SecondaryInformation day={0} hoverIndex={1} />
            </ChartContext>
        );

        expect(Helpers[fn.name as keyof typeof Helpers]).toHaveBeenCalledOnce();
    });

    test(`Day > 0 doesn't call ${fn.name}`, day => {
        const { container } = render(
            <ChartContext view={view} day={1}>
                <SecondaryInformation day={1} hoverIndex={-1} />
            </ChartContext>
        );

        expect.soft(container.querySelector("svg")).toBeEmptyDOMElement();
        expect.soft(Helpers[fn.name as keyof typeof Helpers]).not.toHaveBeenCalled();
    });
});

describe.each([
    ["precipitation", "precipitation_probability", "Chance of Precip"],
    ["temperature_2m", "apparent_temperature", "Feels"],
    ["relativehumidity_2m", "dewpoint_2m", "Dewpoint"],
    ["dewpoint_2m", "relativehumidity_2m", "Humidity"],
    ["windspeed_10m", "windgusts_10m", "Gust"],
] as [ChartViews, keyof Omit<CombinedHourly, "time">, string][])(
    "When given view %s, secondaryInformation is provided by %s",
    (view, property, label) => {
        test("When hoverIndex is -1 and day 0, secondaryInformation is current value", () => {
            const weather = useWeather.useWeather().weather;
            const value = weather.getForecast(property);
            const unit = weather.getForecastUnit(property);

            render(
                <ChartContext view={view} day={0}>
                    <SecondaryInformation day={0} hoverIndex={-1} />
                </ChartContext>
            );

            expect(
                screen.getByText(`${label}: ${TooltipHelpers.trunc(value)}${unit}`)
            ).toBeInTheDocument();
        });

        test("Day > 0 and hoverIndex = -1 uses getLowHigh", () => {
            render(
                <ChartContext view={view} day={1}>
                    <SecondaryInformation day={1} hoverIndex={-1} />
                </ChartContext>
            );

            expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledOnce();
            expect
                .soft(TooltipHelpers.getLowHigh)
                .toHaveBeenCalledWith(expect.anything(), property, 1);
        });

        test("HoverIndex > -1 and day = 0", () => {
            const weather = useWeather.useWeather().weather;
            const value = weather.getForecast(property, 1);
            const unit = weather.getForecastUnit(property);

            render(
                <ChartContext view={view} day={0}>
                    <SecondaryInformation day={0} hoverIndex={1} />
                </ChartContext>
            );

            expect(
                screen.getByText(`${label}: ${TooltipHelpers.trunc(value)}${unit}`)
            ).toBeInTheDocument();
        });
    }
);
