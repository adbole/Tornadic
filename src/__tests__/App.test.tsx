import { act, fireEvent, render, screen } from "@testing-library/react";

import App from "App";
import { Base as DailyBase } from "Components/Daily/style";
import { Base as HourlyBase } from "Components/Hourly/style";
import { Base as NowBase } from "Components/Now/style";
import { Base as RadarBase } from "Components/Radar/style";


type FetchErrorHandlerProps = { 
    children: React.ReactNode, 
    errorRender: (hasError: boolean, retry: () => void) => React.ReactNode 
};

type WeatherContextProps = {
    latitude: number,
    longitude: number,
    children: React.ReactNode,
    skeletonRender: () => React.ReactNode,
};

const componentMocks = vi.hoisted(() => ({
    FetchErrorHandler: vi.fn(({ children }: FetchErrorHandlerProps) => (
        <div>FetchErrorHandler - {children}</div>
    )),
    WeatherContext: vi.fn(({ children }: WeatherContextProps) => (
        <div>WeatherContext - {children}</div>
    )),
}))

vi.mock("Components", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Alert: () => <div>Alert</div>,
    Daily: () => <div>Daily</div>,
    FetchErrorHandler: componentMocks.FetchErrorHandler,
    HazardLevel: ({ hazard }: { hazard: string }) => <div>HazardLevel - {hazard}</div>,
    Hourly: () => <div>Hourly</div>,
    LocationInput: () => <div>LocationInput</div>,
    Modal: ({ children, isOpen, onClose }: { children: React.ReactNode, isOpen: boolean, onClose: () => void }) => (
        isOpen && (
            <dialog open>
                Modal
                <button onClick={onClose}>Invoke onClose</button>
                {children}
            </dialog>
        )
    ),
    ModalContent: ({ children }: { children: React.ReactNode }) => <div>ModalContent - {children}</div>,
    Now: () => <div>Now</div>,
    Pressure: () => <div>Pressure</div>,
    Radar: () => <div>Radar</div>,
    Simple: ({ icon, title, property }: { icon: React.ReactNode, title: string, property: string }) => (
        <div>{icon} - {title} - {property}</div>
    ),
    Skeleton: ({ className, size }: { className: string, size: string }) => (
        <div className={className}>Skeleton - {size}</div>
    ),
    SunTime: () => <div>SunTime</div>,
    Toast: ({ isOpen, action, children }: { 
        isOpen: boolean, 
        action: { content: string, onClick: () => void }, 
        children: React.ReactNode
    }) => (
        isOpen && (
            <div>
                Toast
                <button onClick={action.onClick}>{action.content}</button>
                {children}
            </div>
        )
    ),
    Wind: () => <div>Wind</div>,
}));

vi.mock("Contexts/WeatherContext", async (importOriginal) => ({
    ...(await importOriginal() as any),
    default: componentMocks.WeatherContext,
}));

vi.mock("svgs", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Spinner: () => <div>Spinner</div>,
    WifiOff: () => <div>WifiOff</div>,
}));

vi.mock("svgs/radar", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Cursor: () => <div>Cursor</div>,
}));

vi.mock("svgs/widget", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Droplet: () => <>Droplet</>,
    Thermometer: () => <>Thermometer</>,
    Moisture: () => <>Moisture</>,
    Eye: () => <>Eye</>,
}));

const hookMocks = vi.hoisted(() => ({
    useOnlineOffline: vi.fn(() => true),
    useUserLocation: vi.fn(() => ({ status: "no_value" })),
}))

vi.mock("Hooks", async (importOriginal) => ({
    ...(await importOriginal() as any),
    useOnlineOffline: hookMocks.useOnlineOffline,
    useUserLocation: hookMocks.useUserLocation,
}));

beforeEach(() => {
    vi.clearAllMocks();
})


test("When the app is offline, a message is shown", () => {
    hookMocks.useOnlineOffline.mockReturnValueOnce(false);

    render(<App />);

    expect.soft(screen.queryByText(/Tornadic requires an internet connection/)).toBeInTheDocument();
})

describe("Location", () => {
    test("When there is no location, a message is shown to set it", () => {
        render(<App />);
    
        expect.soft(screen.queryByText("Cursor")).toBeInTheDocument()
        expect.soft(screen.queryByText(/Tornadic requires you to provide a location/)).toBeInTheDocument();
        
        act(() => {
            fireEvent.click(screen.getByText(/Provide Location/));
        })
    
        expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
        expect.soft(screen.queryByText(/ModalContent/)).toBeInTheDocument();
        expect.soft(screen.queryByText("LocationInput")).toBeInTheDocument();
    
        act(() => {
            fireEvent.click(screen.getByText(/Invoke onClose/));
        })
    
        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
    })

    test("When getting the location a spinner is shown with a message", () => {
        hookMocks.useUserLocation.mockReturnValueOnce({ status: "getting_current" });

        render(<App />);

        expect.soft(screen.queryByText("Spinner")).toBeInTheDocument();
        expect.soft(screen.queryByText("Getting Your Location")).toBeInTheDocument();
    })

    test("When the location is available, the app renders", () => {
        hookMocks.useUserLocation.mockReturnValueOnce({ 
            latitude: 0,
            longitude: 0,
            status: "OK" 
        } as any);

        render(<App />);

        expect.soft(screen.queryByText(/FetchErrorHandler/)).toBeInTheDocument();
        expect.soft(screen.queryByText(/WeatherContext/)).toBeInTheDocument();
        expect.soft(screen.queryByText("Now")).toBeInTheDocument();
        expect.soft(screen.queryByText("Alert")).toBeInTheDocument();
        expect.soft(screen.queryByText("Hourly")).toBeInTheDocument();
        expect.soft(screen.queryByText("Daily")).toBeInTheDocument();
        expect.soft(screen.queryByText("Radar")).toBeInTheDocument();

        expect.soft(screen.queryByText("Droplet - Precipitation - precipitation")).toBeInTheDocument();
        expect.soft(screen.queryByText("Thermometer - Dewpoint - dewpoint_2m")).toBeInTheDocument();
        expect.soft(screen.queryByText("Moisture - Humidity - relativehumidity_2m")).toBeInTheDocument();

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
        )
    })
})

test("FetchErrorHandler's errorRender renders a toast and correctly provides retry", () => {
    const retry = vi.fn()

    componentMocks.FetchErrorHandler.mockImplementationOnce(
        ({ children, errorRender }: FetchErrorHandlerProps) => (
            <div>
                FetchErrorHandler - 
                {children}
                {errorRender(true, retry)}
            </div>
        )
    )

    hookMocks.useUserLocation.mockReturnValueOnce({ 
        latitude: 0,
        longitude: 0,
        status: "OK" 
    } as any);

    render(<App />);

    expect.soft(screen.queryByText(/Could not get weather data/)).toBeInTheDocument();

    act(() => {
        fireEvent.click(screen.getByText("Try Again"));
    })

    expect.soft(retry).toHaveBeenCalledOnce();
})

test("The weather context is provided with skeletonRender", () => {
    componentMocks.WeatherContext.mockImplementationOnce(
        ({ skeletonRender }: WeatherContextProps) => (
            <div>
                WeatherContext - 
                {skeletonRender()}
            </div>
        )
    )

    hookMocks.useUserLocation.mockReturnValueOnce({ 
        latitude: 0,
        longitude: 0,
        status: "OK" 
    } as any);

    render(<App />);

    const skeletons = screen.queryAllByText(/Skeleton/);

    expect(skeletons).toHaveLength(13);

    //Verify the widgets use the correct skeleton size and base classes
    //See each base class' component for responsive size tests
    
    expect.soft(skeletons[0].className).toContain(NowBase.name)
    expect.soft(skeletons[0].textContent).toContain("widget-large")

    expect.soft(skeletons[1].className).toContain(HourlyBase.name)
    expect.soft(skeletons[1].textContent).toContain("widget-wide")

    expect.soft(skeletons[2].className).toContain(DailyBase.name)
    expect.soft(skeletons[2].textContent).toContain("widget-large")

    expect.soft(skeletons[3].className).toContain(RadarBase.name)
    expect.soft(skeletons[3].textContent).toContain("widget-large")

    expect.soft(screen.getAllByText("Skeleton -")).toHaveLength(8)

    expect.soft(skeletons[skeletons.length - 1].textContent).toContain("widget-wide")
})