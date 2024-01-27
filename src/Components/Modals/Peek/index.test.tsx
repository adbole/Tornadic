import testIds from "@test-consts/testIDs";
import { matchBrokenText } from "@test-utils";

import { act, render, screen } from "@testing-library/react";

import FetchErrorHandler from "Components/FetchErrorHandler";

import Peek from ".";

//Peek acts as a mini version of the application as a whole, so tests here
//are only checking that the correct components are rendered and get proper props
//hence all the mocks

const mockFetchErrorHanlder = "FetchErrorHandler";
const mockRetry = vi.fn();
const mockWeatherContext = "WeatherContext";
const mockNow = "Now";
const mockAlert = "Alert";
const mockWind = "Wind";
const mockPressure = "Pressure";
const mockHazard = "HazardLevel";

vi.mock("Components/FetchErrorHandler");

// prettier-ignore
const mockFetchErrorHandlerFactory = (error: boolean) => (
    // eslint-disable-next-line react/function-component-definition
    ({ errorRender, children }: { 
        errorRender: (hasError: boolean, retry: () => void) => JSX.Element, 
        children: React.ReactNode 
    }) => (
        <div data-testid={mockFetchErrorHanlder}>
                {errorRender(error, mockRetry)}
                {children}
        </div>
    ) 
)

vi.mock("Contexts/WeatherContext", () => ({
    default: ({
        latitude,
        longitude,
        children,
        skeletonRender,
    }: {
        latitude: number;
        longitude: number;
        children: React.ReactNode;
        skeletonRender: () => JSX.Element;
    }) => (
        <div data-testid={mockWeatherContext}>
            <p>Lat: {latitude}</p>
            <p>Long: {longitude}</p>
            {skeletonRender()}
            {children}
        </div>
    ),
}));

vi.mock("Components/Now", () => ({
    default: ({ displayOnly }: { displayOnly: boolean }) => (
        <div data-testid={mockNow}>
            <p>Display Only: {displayOnly.toString()}</p>
        </div>
    ),
}));

vi.mock("Components/Alert", () => ({ default: () => <div data-testid={mockAlert} /> }));

vi.mock("Components/Simple", () => ({
    default: ({
        icon,
        title,
        property,
    }: {
        icon: React.ReactNode;
        title: string;
        property: string;
    }) => (
        <div>
            <p>Icon: {icon}</p>
            <p>Title: {title}</p>
            <p>Property: {property}</p>
        </div>
    ),
}));

vi.mock("Components/Wind", () => ({ default: () => <div data-testid={mockWind} /> }));
vi.mock("Components/Pressure", () => ({ default: () => <div data-testid={mockPressure} /> }));

vi.mock("Components/HazardLevel", () => ({
    default: ({ hazard }: { hazard: string }) => (
        <div data-testid={mockHazard}>
            <p>Hazard: {hazard}</p>
        </div>
    ),
}));

vi.mock("svgs/widget", () => ({
    Droplet: () => <span>Droplet</span>,
    Eye: () => <span>Eye</span>,
    Moisture: () => <span>Moisture</span>,
    Thermometer: () => <span>Thermometer</span>,
}));

test("Renders nothing if isOpen is false", () => {
    render(<Peek isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Renders a dialog if isOpen is true", () => {
    render(<Peek isOpen={true} onClose={vi.fn()} />);

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
});

describe("FetchErrorHandler", () => {
    test("Renders the FetchErrorHandler with with the error shown", () => {
        vi.mocked(FetchErrorHandler).mockImplementation(mockFetchErrorHandlerFactory(true));

        render(<Peek isOpen={true} onClose={vi.fn()} />);

        expect.soft(screen.queryByTestId(mockFetchErrorHanlder)).toBeInTheDocument();
        expect.soft(screen.queryByText("Couldn't get weather info")).toBeInTheDocument();

        const retryBtn = screen.getByText("Try Again");

        expect.soft(retryBtn).toBeInTheDocument();

        act(() => {
            retryBtn.click();
        });

        expect.soft(mockRetry).toHaveBeenCalledOnce();
    });

    test("Error has display: None if FetchErrorHandler passes false to errorRender", () => {
        vi.mocked(FetchErrorHandler).mockImplementation(mockFetchErrorHandlerFactory(false));

        render(<Peek isOpen={true} onClose={vi.fn()} />);

        expect.soft(screen.queryByTestId(mockFetchErrorHanlder)).toBeInTheDocument();

        expect
            .soft(screen.getByText("Couldn't get weather info").parentElement)
            .toHaveStyle({ display: "none" });
    });
});

describe("WeatherContext", () => {
    beforeEach(() => {
        render(<Peek isOpen={true} onClose={vi.fn()} latitude={365} longitude={405} />);
    });

    test("Renders the WeatherContext with the correct props", () => {
        expect.soft(screen.queryByTestId(mockWeatherContext)).toBeInTheDocument();
        expect.soft(screen.queryByText("Lat: 365")).toBeInTheDocument();
        expect.soft(screen.queryByText("Long: 405")).toBeInTheDocument();
    });

    test("Renders the correct skeletons with the proper styles", () => {
        const skeletons = screen.getAllByTestId(testIds.Widget.WidgetSection);
        const nowSkeleton = skeletons[0];

        expect.soft(nowSkeleton).toBeInTheDocument();
        expect.soft(nowSkeleton).toHaveStyleRule("grid-column", "span 2");
        expect.soft(nowSkeleton).toHaveStyleRule("grid-row", "span 2");

        const alertSkeleton = skeletons[1];
        expect.soft(alertSkeleton).toBeInTheDocument();
        expect.soft(alertSkeleton).toHaveStyleRule("grid-column", "span 2");
        expect.soft(alertSkeleton).not.toHaveStyleRule("grid-row", "span 2");

        //Since skeleton isn't mocked its WidgetSection testid still shows therefore
        //10 should be present
        expect.soft(skeletons).toHaveLength(10);
    });

    test("Renders Now with displayOnly set to true", () => {
        expect.soft(screen.queryByTestId(mockNow)).toBeInTheDocument();
        expect.soft(screen.queryByText("Display Only: true")).toBeInTheDocument();
    });

    test("Renders Alert, Wind, Pressure", () => {
        expect.soft(screen.queryByTestId(mockAlert)).toBeInTheDocument();
        expect.soft(screen.queryByTestId(mockWind)).toBeInTheDocument();
        expect.soft(screen.queryByTestId(mockPressure)).toBeInTheDocument();
    });

    test("Renders the Simple widgets with the correct props", () => {
        const simpleWidget = (icon: string, title: string, property: string) =>
            matchBrokenText(`Icon: ${icon}Title: ${title}Property: ${property}`);

        expect
            .soft(screen.getByText(simpleWidget("Droplet", "Precipitation", "precipitation")))
            .toBeInTheDocument();

        expect
            .soft(screen.getByText(simpleWidget("Thermometer", "Dewpoint", "dewpoint_2m")))
            .toBeInTheDocument();

        expect
            .soft(screen.getByText(simpleWidget("Moisture", "Humidity", "relativehumidity_2m")))
            .toBeInTheDocument();

        expect
            .soft(screen.getByText(simpleWidget("Eye", "Visibility", "visibility")))
            .toBeInTheDocument();
    });

    test("Renders the HazardLevel widgets with the correct props", () => {
        expect.soft(screen.queryByText("Hazard: us_aqi")).toBeInTheDocument();
        expect.soft(screen.queryByText("Hazard: uv_index")).toBeInTheDocument();
    });
});
