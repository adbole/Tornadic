import { act, render, screen } from "@testing-library/react";
import * as d3 from "d3";

import { AVG_INDEX, MAX_INDEX, MIN_INDEX } from "./__internal__";
import Ensemble from ".";


function constructEnsembleData() {
    return {
        time: new Array(24).fill("123"),
        data: Array.from({ length: 31 }, () => Array.from({ length: 24 }, (_, i) => i)),
    };
}

const mocks = vi.hoisted(() => ({
    useEnsemble: vi.fn(),
    Chart: vi.fn(({ children }: { children: React.ReactNode }) => (
        <>
            <p>Chart</p>
            {children}
        </>
    )),
    Line: vi.fn(() => <p>Line</p>),
}));

vi.mock("Contexts/WeatherContext", () => ({
    useWeather: () => ({ point: { geometry: { coordinates: [-10, 10] } } }),
}));

vi.mock("Hooks", () => ({
    useEnsemble: mocks.useEnsemble,
}));

vi.mock("Components/Chart", () => ({
    default: mocks.Chart,
    useChart: vi.fn(),
}));

vi.mock("Components/Chart/Components", () => ({
    Axes: () => <p>Axes</p>,
    Line: mocks.Line,
    NowReference: ({ isShown }: { isShown: boolean }) => <p>NowReference - {isShown.toString()}</p>,
    Tooltip: ({ children }: { children: React.ReactNode }) => (
        <>
            <p>Tooltip</p>
            {children}
        </>
    ),
}));

vi.mock("./__internal__", async importOriginal => ({
    ...(await importOriginal<any>()),
    Outliers: ({ fill }: { fill: string }) => <p>Outliers - {fill}</p>,
    TooltipDisplay: () => <p>TooltipDisplay</p>,
}));

vi.mock("../Standard/__internal__/Tooltip", () => ({
    Time: () => <p>Time</p>,
}));

vi.mock("svgs", () => ({
    ExclamationTriangle: () => <p>ExclamationTriangle</p>,
    Spinner: () => <p>Spinner</p>,
}));

beforeEach(() => {
    mocks.useEnsemble.mockReturnValue({ ensemble: constructEnsembleData() });
});

test("Renders as expected", async () => {
    render(<Ensemble view="temperature_2m" day={0} />);

    expect.soft(screen.queryByText("Chart")).toBeInTheDocument();

    expect.soft(screen.queryByText("Axes")).toBeInTheDocument();
    expect.soft(screen.queryAllByText("Line"));
    expect.soft(screen.queryByText("Outliers - red")).toBeInTheDocument();

    expect.soft(screen.queryByText("NowReference - true")).toBeInTheDocument();

    expect.soft(screen.queryByText("Tooltip")).toBeInTheDocument();
    expect.soft(screen.queryByText("Time")).toBeInTheDocument();
    expect.soft(screen.queryByText("TooltipDisplay")).toBeInTheDocument();
});

test("Uses point coordinates to fetch ensemble data", () => {
    render(<Ensemble view="temperature_2m" day={0} />);

    expect(mocks.useEnsemble).toHaveBeenCalledWith("temperature_2m", 10, -10);
});

test("If view is us_aqi, display a message", () => {
    render(<Ensemble view="us_aqi" day={0} />);

    expect.soft(mocks.useEnsemble).toHaveBeenCalledWith(undefined, 10, -10);
    expect.soft(screen.queryByText("Variable is not supported for Ensemble")).toBeInTheDocument();
});

test("Displays loading spinner", () => {
    mocks.useEnsemble.mockReturnValue({ isLoading: true });

    render(<Ensemble view="temperature_2m" day={0} />);

    expect(screen.queryByText("Spinner")).toBeInTheDocument();
});

test("Displays error message and allows retry", () => {
    const mutate = vi.fn();

    //While the data isn't in the correct format, it doesn't matter as we simply
    //want to test that the data is properly passed to mutate
    mocks.useEnsemble.mockReturnValue({ ensemble: [1], error: "Error", mutate });

    render(<Ensemble view="temperature_2m" day={0} />);

    expect.soft(screen.queryByText("An error occurred while getting the data")).toBeInTheDocument();

    act(() => {
        screen.getByRole("button").click();
    });

    expect.soft(mutate).toHaveBeenCalledOnce();
    expect.soft(mutate).toHaveBeenCalledWith([1]);
});

describe("NowReference", () => {
    test("When the day is 0, NowReference is shown", () => {
        render(<Ensemble view="temperature_2m" day={0} />);

        expect(screen.getByText("NowReference - true")).toBeInTheDocument();
    });

    test("When the day is not 0, NowReference is not shown", () => {
        //The day itself doesn't matter, just that it's not 0
        //Ensemble (like Standard) takes advantage of javascript's truthy/falsy values
        render(<Ensemble view="temperature_2m" day={585920} />);

        expect(screen.getByText("NowReference - false")).toBeInTheDocument();
    });
});

test("Prepares the data as expected", () => {
    const ensemble = constructEnsembleData();
    mocks.useEnsemble.mockReturnValue({ ensemble, isLoading: false });

    render(<Ensemble view="temperature_2m" day={0} />);

    const members = d3.transpose(ensemble.data.map(member => member.slice(0, 24)));

    const mins = members.map(member => d3.min(member) ?? 0);
    const maxes = members.map(member => d3.max(member) ?? 0);
    const avg = members.map(member => d3.mean(member) ?? 0);

    const dataPoints = (mocks.Chart.mock.lastCall![0] as any).dataPoints;

    expect.soft(dataPoints).toHaveLength(24);

    dataPoints.forEach((point: any, i: number) => {
        expect.soft(point.x).toBeInstanceOf(Date);
        expect.soft(point.y).toEqual([mins[i], maxes[i], avg[i], ...members[i]]);
    });
});

test("Creates distinct lines for each ensemble member and min/max/avg lines", () => {
    mocks.useEnsemble.mockReturnValue({ ensemble: constructEnsembleData(), isLoading: false });

    render(<Ensemble view="temperature_2m" day={0} />);

    const numNormal = 31;
    const numMinMaxAvg = 3;

    const lines = screen.queryAllByText("Line");
    expect.soft(lines).toHaveLength(numNormal + numMinMaxAvg);

    const minMaxAvg = mocks.Line.mock.calls.slice(-numMinMaxAvg);

    expect.soft((minMaxAvg[0] as any[])[0]).toStrictEqual({
        yIndex: MIN_INDEX,
        stroke: "white",
        strokeWidth: 3,
    });

    expect.soft((minMaxAvg[1] as any[])[0]).toStrictEqual({
        yIndex: MAX_INDEX,
        stroke: "white",
        strokeWidth: 3,
    });

    expect.soft((minMaxAvg[2] as any[])[0]).toStrictEqual({
        yIndex: AVG_INDEX,
        stroke: "#0078ef",
        strokeWidth: 3,
    });

    const normalLines = mocks.Line.mock.calls.slice(0, numNormal);
    for (let i = 0; i < numNormal; i++) {
        expect.soft((normalLines[i] as any[])[0]).toStrictEqual({
            yIndex: AVG_INDEX + i,
            stroke: "#636363",
        });
    }
});

test("Displays No Data if all data points are null", () => {
    const ensemble = constructEnsembleData();
    ensemble.data = ensemble.data.map(() => new Array(24).fill(null));

    mocks.useEnsemble.mockReturnValue({ ensemble, isLoading: false });

    render(<Ensemble view="temperature_2m" day={0} />);

    expect.soft(screen.getByText("No Data")).toBeInTheDocument();
});
