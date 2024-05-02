import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";

import Weather from "ts/Weather";

import Standard from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const mocks = vi.hoisted(() => ({
    Chart: vi.fn(({ children }: { children: React.ReactNode }) => (
        <>
            <p>Chart</p>
            {children}
        </>
    )),
}));

vi.mock("Components/Chart", () => ({
    default: mocks.Chart,
}));

vi.mock("Components/Chart/Components", () => ({
    Axes: () => <p>Axes</p>,
    NowReference: ({ isShown }: { isShown: boolean }) => <p>NowReference - {isShown.toString()}</p>,
    Tooltip: ({ children }: { children: React.ReactNode }) => (
        <>
            <p>Tooltip</p>
            {children}
        </>
    ),
}));

vi.mock("./__internal__/Tooltip", () => ({
    Time: () => <p>Time</p>,
    PrimaryInformation: () => <p>PrimaryInformation</p>,
    SecondaryInformation: () => <p>SecondaryInformation</p>,
}));

vi.mock("./__internal__/ChartVisualization", () => ({
    default: () => <p>ChartVisualization</p>,
}));

test("Renders the expected components", () => {
    const { container } = render(<Standard view="temperature_2m" day={0} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          Chart
        </p>
        <p>
          Axes
        </p>
        <p>
          ChartVisualization
        </p>
        <p>
          NowReference - 
          true
        </p>
        <p>
          Tooltip
        </p>
        <p>
          Time
        </p>
        <p>
          PrimaryInformation
        </p>
        <p>
          SecondaryInformation
        </p>
      </div>
    `);
});

describe("Datapoint setup: views without supporting data", () => {
    test.each([
        "dewpoint_2m",
        "precipitation",
        "relativehumidity_2m",
        "surface_pressure",
        "us_aqi",
        "uv_index",
        "visibility",
    ] as ChartViews[])("%s", view => {
        render(<Standard view={view} day={0} />);

        const { weather } = useWeather();
        const xPoints = weather
            .getAllForecast("time")
            .slice(0, 24)
            .map(time => new Date(time));
        const yPoints = weather.getAllForecast(view).slice(0, 24);

        expect(mocks.Chart).toHaveBeenCalledWith(
            expect.objectContaining({
                dataPoints: xPoints.map((x, i) => ({ x, y: [yPoints[i]] })),
            }),
            {}
        );
    });
});

describe("Datapoint setup: views with supporting data", () => {
    test.each([
        ["temperature_2m", "apparent_temperature"],
        ["windspeed_10m", "windgusts_10m"],
    ] as [ChartViews, keyof Forecast["hourly"]][])("%s", (view, y2) => {
        render(<Standard view={view} day={0} />);

        const { weather } = useWeather();
        const xPoints = weather
            .getAllForecast("time")
            .slice(0, 24)
            .map(time => new Date(time));
        const yPoints = weather.getAllForecast(view).slice(0, 24);
        const y2Points = weather.getAllForecast(y2).slice(0, 24);

        expect(mocks.Chart).toHaveBeenCalledWith(
            expect.objectContaining({
                dataPoints: xPoints.map((x, i) => ({ x, y: [yPoints[i], y2Points[i]] })),
            }),
            {}
        );
    });
});

describe("Datapoints are offset for each day", () => {
    test.each([1, 2, 3, 4, 5])("Day %s", day => {
        render(<Standard view="temperature_2m" day={day} />);

        const from = day * 24;
        const to = from + 24;

        const { weather } = useWeather();

        const xPoints = weather
            .getAllForecast("time")
            .slice(from, to)
            .map(time => new Date(time));
        const yPoints = weather.getAllForecast("temperature_2m").slice(from, to);
        const y2Points = weather.getAllForecast("apparent_temperature").slice(from, to);

        expect.soft(xPoints).toHaveLength(24);
        expect.soft(y2Points).toHaveLength(24);
        expect.soft(y2Points).toHaveLength(24);

        expect.soft(mocks.Chart).toHaveBeenCalledWith(
            expect.objectContaining({
                dataPoints: xPoints.map((x, i) => ({ x, y: [yPoints[i], y2Points[i]] })),
            }),
            {}
        );
    });
});

test("Precipitation view uses band type", () => {
    render(<Standard view="precipitation" day={0} />);

    expect(mocks.Chart).toHaveBeenCalledWith(
        expect.objectContaining({
            type: "band",
        }),
        {}
    );
});

describe("NowReference", () => {
    test("When the day is 0, NowReference is shown", () => {
        render(<Standard view="temperature_2m" day={0} />);

        expect(screen.getByText("NowReference - true")).toBeInTheDocument();
    });

    test("When the day is not 0, NowReference is not shown", () => {
        //The day itself doesn't matter, just that it's not 0
        //Standard takes advantage of javascript's truthy/falsy values
        render(<Standard view="temperature_2m" day={585920} />);

        expect(screen.getByText("NowReference - false")).toBeInTheDocument();
    });
});

describe("When there is no data", () => {
    test("No Data is shown", () => {
        vi.spyOn(Weather.prototype, "getAllForecast").mockReturnValue(new Array(24).fill(null));

        render(<Standard view="temperature_2m" day={0} />);

        expect(screen.getByText("No Data")).toBeInTheDocument();
    });
});
