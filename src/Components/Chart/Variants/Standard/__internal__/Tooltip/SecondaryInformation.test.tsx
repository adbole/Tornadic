import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";

import Chart from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";

import * as Helpers from "ts/Helpers";
import type { CombinedHourly } from "ts/Weather";

import * as TooltipHelpers from "./Helpers";
import { SecondaryInformation } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));
vi.mock("Components/Chart/Components");
vi.spyOn(TooltipHelpers, "getLowHigh");

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [i],
}));

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Chart dataPoints={dataPoints} type="linear">
            {children}
        </Chart>
    );
}

test("When given a property that doesn't have secondaryInformation provided, returns null", () => {
    vi.mocked(useTooltip).mockReturnValue(-1);

    const { container } = render(
        <Wrapper>
            <SecondaryInformation view="visibility" day={0} />
        </Wrapper>
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
        vi.mocked(useTooltip).mockReturnValue(-1);

        render(
            <Wrapper>
                <SecondaryInformation day={0} view={view} />
            </Wrapper>
        );

        expect(Helpers[fn.name as keyof typeof Helpers]).toHaveBeenCalledOnce();
    });

    test(`Uses ${fn.name} for secondaryInformation on hoverIndex != -1`, () => {
        vi.mocked(useTooltip).mockReturnValue(1);

        render(
            <Wrapper>
                <SecondaryInformation day={0} view={view} />
            </Wrapper>
        );

        expect(Helpers[fn.name as keyof typeof Helpers]).toHaveBeenCalledOnce();
    });

    test(`Day > 0 doesn't call ${fn.name}`, () => {
        vi.mocked(useTooltip).mockReturnValue(-1);

        const { container } = render(
            <Wrapper>
                <SecondaryInformation day={1} view={view} />
            </Wrapper>
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
            vi.mocked(useTooltip).mockReturnValue(-1);

            const weather = useWeather().weather;
            const value = weather.getForecast(property);
            const unit = weather.getForecastUnit(property);

            render(
                <Wrapper>
                    <SecondaryInformation day={0} view={view} />
                </Wrapper>
            );

            expect(
                screen.getByText(`${label}: ${Helpers.trunc(value)}${unit}`)
            ).toBeInTheDocument();
        });

        test("Day > 0 and hoverIndex = -1 uses getLowHigh", () => {
            vi.mocked(useTooltip).mockReturnValue(-1);

            render(
                <Wrapper>
                    <SecondaryInformation day={1} view={view} />
                </Wrapper>
            );

            expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledOnce();
            expect
                .soft(TooltipHelpers.getLowHigh)
                .toHaveBeenCalledWith(expect.anything(), property, 1);
        });

        test("HoverIndex > -1 and day = 0", () => {
            vi.mocked(useTooltip).mockReturnValue(1);

            const weather = useWeather().weather;
            const value = weather.getForecast(property, 1);
            const unit = weather.getForecastUnit(property);

            render(
                <Wrapper>
                    <SecondaryInformation day={0} view={view} />
                </Wrapper>
            );

            expect(
                screen.getByText(`${label}: ${Helpers.trunc(value)}${unit}`)
            ).toBeInTheDocument();
        });
    }
);
