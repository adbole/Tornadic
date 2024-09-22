import { userTest } from "@test-utils";

import { render, screen } from "@testing-library/react";
import type { useUserLocation } from "Hooks";

import App from "App";


type FetchErrorHandlerProps = {
    children: React.ReactNode;
    errorRender: (hasError: boolean, retry: () => void) => React.ReactNode;
};

type WeatherContextProps = {
    latitude: number;
    longitude: number;
    children: React.ReactNode;
    skeleton: React.ReactNode;
};

const componentMocks = vi.hoisted(() => ({
    FetchErrorHandler: vi.fn(({ children }: FetchErrorHandlerProps) => (
        <div>FetchErrorHandler - {children}</div>
    )),
    WeatherContext: vi.fn(({ children }: WeatherContextProps) => (
        <div>WeatherContext - {children}</div>
    )),
}));

vi.mock("Components", async importOriginal => ({
    ...((await importOriginal()) as any),
    Alert: ({ noNotify = false }) => <div>Alert - No Notify: {noNotify.toString()}</div>,
    Background: () => <div>Background</div>,
    Daily: () => <div>Daily</div>,
    FetchErrorHandler: componentMocks.FetchErrorHandler,
    HazardLevel: ({ hazard }: { hazard: string }) => <div>HazardLevel - {hazard}</div>,
    Hourly: () => <div>Hourly</div>,
    LocationInput: () => <div>LocationInput</div>,
    Modal: ({
        children,
        isOpen,
        onClose,
    }: {
        children: React.ReactNode;
        isOpen: boolean;
        onClose: () => void;
    }) =>
        isOpen && (
            <dialog open>
                Modal
                <button onClick={onClose}>Invoke onClose</button>
                {children}
            </dialog>
        ),
    ModalContent: ({ children }: { children: React.ReactNode }) => (
        <div>ModalContent - {children}</div>
    ),
    Now: ({ displayOnly = false }) => <div>Now - Display Only: {displayOnly.toString()}</div>,
    Pressure: () => <div>Pressure</div>,
    Radar: () => <div>Radar</div>,
    Simple: ({
        icon,
        title,
        property,
    }: {
        icon: React.ReactNode;
        title: string;
        property: string;
    }) => (
        <div>
            {icon} - {title} - {property}
        </div>
    ),
    Skeleton: ({ className, size }: { className: string; size: string }) => (
        <div className={className}>Skeleton - {size}</div>
    ),
    SunTime: () => <div>SunTime</div>,
    Toast: ({
        isOpen,
        actions,
        children,
    }: {
        isOpen: boolean;
        actions: { content: string; onClick: () => void }[];
        children: React.ReactNode;
    }) =>
        isOpen && (
            <div>
                Toast
                {actions?.map(({ content, onClick }) => (
                    <button onClick={onClick} key={content}>
                        {content}
                    </button>
                ))}
                {children}
            </div>
        ),
    Wind: () => <div>Wind</div>,
}));

vi.mock("Contexts/WeatherContext", async importOriginal => ({
    ...((await importOriginal()) as any),
    default: componentMocks.WeatherContext,
}));

vi.mock("svgs", () => ({
    Spinner: () => <div>Spinner</div>,
    WifiOff: () => <div>WifiOff</div>,
}));

vi.mock("svgs/radar", async importOriginal => ({
    ...((await importOriginal()) as any),
    Cursor: () => <div>Cursor</div>,
}));

vi.mock("svgs/widget", () => ({
    Droplet: () => <>Droplet</>,
    Thermometer: () => <>Thermometer</>,
    Moisture: () => <>Moisture</>,
    Eye: () => <>Eye</>,
}));

const hookMocks = vi.hoisted(() => ({
    useOnlineOffline: vi.fn(() => true),
    useUserLocation: vi.fn(() => ({ status: "no_value" })),
}));

vi.mock("Hooks", async importOriginal => ({
    ...((await importOriginal()) as any),
    useOnlineOffline: hookMocks.useOnlineOffline,
    useUserLocation: hookMocks.useUserLocation,
}));

test("When the app is offline, a message is shown", () => {
    hookMocks.useOnlineOffline.mockReturnValueOnce(false);

    render(<App />);

    expect.soft(screen.queryByText(/Tornadic requires an internet connection/)).toBeInTheDocument();
});

describe("Location", () => {
    userTest("When there is no location, a message is shown to set it", async ({ user }) => {
        render(<App />);

        expect.soft(screen.queryByText("Cursor")).toBeInTheDocument();
        expect
            .soft(screen.queryByText(/Tornadic requires you to provide a location/))
            .toBeInTheDocument();

        await user.click(screen.getByText(/Provide Location/));

        expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
        expect.soft(screen.queryByText(/ModalContent/)).toBeInTheDocument();
        expect.soft(screen.queryByText("LocationInput")).toBeInTheDocument();

        await user.click(screen.getByText(/Invoke onClose/));

        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test.each([
        [
            "denied",
            "You have denied location access. To use your current location, please enable location access in your browser settings and refresh the page.",
        ],
        [
            "unavailable",
            "Your location could not be determined at this time. Please try again later.",
        ],
        [
            "timeout",
            "Your location could not be determined in a timely manner. Please try again later.",
        ],
        [
            "nav_not_supported",
            "Your browser does not support location services. Please use a different browser or device to use your current location.",
        ],
    ] as [ReturnType<typeof useUserLocation>["status"], string][])(
        `When the location status is %s, a message is shown`,
        (status, msg) => {
            hookMocks.useUserLocation.mockReturnValue({ status });

            render(<App />);

            expect
                .soft(screen.queryByText(/Tornadic requires you to provide a location/))
                .toBeInTheDocument();
            expect.soft(screen.getByText(msg)).toBeInTheDocument();
        }
    );

    test("When getting the location a spinner is shown with a message", () => {
        hookMocks.useUserLocation.mockReturnValueOnce({ status: "getting_current" });

        render(<App />);

        expect.soft(screen.queryByText("Spinner")).toBeInTheDocument();
        expect.soft(screen.queryByText("Getting Your Location")).toBeInTheDocument();
    });

    //Normally, the WeatherContext would enter is loading state using a skeleton, however this is ensuring
    //that App is using all the right components when its checks have passed
    test("When the location is available, the app renders", () => {
        hookMocks.useUserLocation.mockReturnValueOnce({
            latitude: 0,
            longitude: 0,
            status: "OK",
        } as any);

        render(<App />);

        expect.soft(screen.queryByText(/FetchErrorHandler/)).toBeInTheDocument();
        expect.soft(screen.queryByText(/WeatherContext/)).toBeInTheDocument();
        expect.soft(screen.queryByText("Now - Display Only: false")).toBeInTheDocument();
        expect.soft(screen.queryByText("Alert - No Notify: false")).toBeInTheDocument();
        expect.soft(screen.queryByText("Hourly")).toBeInTheDocument();
        expect.soft(screen.queryByText("Daily")).toBeInTheDocument();
        expect.soft(screen.queryByText("Radar")).toBeInTheDocument();

        expect
            .soft(screen.queryByText("Droplet - Precipitation - precipitation"))
            .toBeInTheDocument();
        expect.soft(screen.queryByText("Thermometer - Dewpoint - dewpoint_2m")).toBeInTheDocument();
        expect
            .soft(screen.queryByText("Moisture - Humidity - relativehumidity_2m"))
            .toBeInTheDocument();

        expect.soft(screen.queryByText("HazardLevel - us_aqi")).toBeInTheDocument();
        expect.soft(screen.queryByText("HazardLevel - uv_index")).toBeInTheDocument();

        expect.soft(screen.queryByText("Wind")).toBeInTheDocument();
        expect.soft(screen.queryByText("Pressure")).toBeInTheDocument();
        expect.soft(screen.queryByText("SunTime")).toBeInTheDocument();

        expect.soft(screen.queryByText(/Could not get weather data/)).not.toBeInTheDocument();

        expect.soft(componentMocks.WeatherContext).toHaveBeenCalledWith(
            expect.objectContaining({
                latitude: 0,
                longitude: 0,
            }),
            expect.anything()
        );
    });
});

userTest("FetchErrorHandler's errorRender renders a toast and correctly provides retry", async ({ user }) => {
    const retry = vi.fn();

    componentMocks.FetchErrorHandler.mockImplementationOnce(
        ({ children, errorRender }: FetchErrorHandlerProps) => (
            <div>
                FetchErrorHandler -{children}
                {errorRender(true, retry)}
            </div>
        )
    );

    hookMocks.useUserLocation.mockReturnValueOnce({
        latitude: 0,
        longitude: 0,
        status: "OK",
    } as any);

    render(<App />);

    expect.soft(screen.queryByText(/Could not get weather data/)).toBeInTheDocument();

    await user.click(screen.getByText("Try Again Now"));

    expect.soft(retry).toHaveBeenCalledOnce();
});

test("The weather context is provided with a skeleton", () => {
    componentMocks.WeatherContext.mockImplementationOnce(({ skeleton }: WeatherContextProps) => (
        <div>WeatherContext - {skeleton}</div>
    ));

    hookMocks.useUserLocation.mockReturnValueOnce({
        latitude: 0,
        longitude: 0,
        status: "OK",
    } as any);

    const { container } = render(<App />);

    const skeletons = screen.queryAllByText(/Skeleton/);

    expect(skeletons).toHaveLength(13);
    expect(container).toMatchSnapshot();
});
