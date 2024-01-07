import { MapContainer, useMap } from "react-leaflet";
import { rainviewer } from "__tests__/__mocks__";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import L from "leaflet";
import { SWRConfig } from "swr";

import { RainViewer } from "Components/Radar/__internal__";


const rainviewerObj = rainviewer()

beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    const past = rainviewerObj.radar.past
    vi.setSystemTime(past[past.length - 1].time * 1000)
})

afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
})

vi.spyOn(L, "tileLayer")

vi.mock("svgs/radar", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Play: () => <span>Play</span>,
    Pause: () => <span>Pause</span>
}))

vi.mock("svgs", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Spinner: () => <span>Spinner</span>
}))


function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map(), shouldRetryOnError: false }}>
            <MapContainer>
                <RainViewer />
                {children}
            </MapContainer>
        </SWRConfig>
    )
}

const renderRainViewer = () => render(<Wrapper />)

test("Renders as expected", async () => {
    renderRainViewer()

    await act(async () => {
        await vi.advanceTimersToNextTimerAsync()
    })

    expect.soft(screen.queryByText("Past: 8:10 PM")).toBeInTheDocument()
    expect.soft(screen.queryByTitle("Play")).toBeInTheDocument()
    expect.soft(screen.queryByRole("slider")).toBeInTheDocument()
    expect.soft(screen.queryByRole("slider")?.nextElementSibling?.children)
        .toHaveLength(rainviewerObj.radar.past.length + rainviewerObj.radar.nowcast.length) 
})

test("Shows a message while radar data is loaded", async () => {
    renderRainViewer()


    expect.soft(screen.queryByText("Loading Radar...")).toBeInTheDocument()
})

describe("Playback", () => {
    test("Clicking the play button causes the frame to advance", async () => {
        renderRainViewer()

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const playButton = screen.getByTitle("Play")
        const slider = screen.getByRole<HTMLInputElement>("slider")
        
        act(() => {
            fireEvent.click(playButton)
        })

        expect.soft(screen.queryByText("Pause")).toBeInTheDocument()
        expect.soft(screen.queryByTitle("Pause")).toBeInTheDocument()

        expect.soft(screen.queryByText("Forecast: 8:20 PM")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length)
        
        await act(async () => {
            await vi.advanceTimersByTimeAsync(500)
        })

        expect.soft(screen.queryByText("Forecast: 8:30 PM")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length + 1)

        act(() => {
            fireEvent.click(playButton)
        })

        expect.soft(screen.queryByText("Play")).toBeInTheDocument()
    })

    test("Can handle the active layer switching during playback", async () => {
        const { result: { current: map } } = renderHook(useMap, { wrapper: Wrapper })

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const playButton = screen.getByTitle("Play")
        const slider = screen.getByRole<HTMLInputElement>("slider")
        
        act(() => {
            fireEvent.click(playButton)
        })

        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length)

        act(() => {
            map.fire("baselayerchange", { name: "Satellite" })
        })

        //Satellite's now is its last frame, so play would advance to the beginning
        expect.soft(screen.queryByText("Pause")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(0)

        await act(async () => {
            await vi.advanceTimersByTimeAsync(500)
        })

        expect.soft(slider.valueAsNumber).toBe(1)

        act(() => {
            map.fire("baselayerchange", { name: "Radar" })
        })

        expect.soft(screen.queryByText("Pause")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length + 1)
    })

    test("Playback loops to the beginning if the end is reached", async () => {
        renderRainViewer()

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const playButton = screen.getByTitle("Play")
        
        act(() => {
            fireEvent.click(playButton)
        })

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500)
        })

        expect.soft(screen.queryByText("Past: 6:10 PM")).toBeInTheDocument()
        expect.soft(screen.getByRole<HTMLInputElement>("slider").valueAsNumber)
            .toBe(0)
    })

    test("A spinner is shown while the layer is loading preventing playback", async () => {
        vi.spyOn(L.TileLayer.prototype, "isLoading").mockReturnValue(true)
        renderRainViewer()

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const playButton = screen.getByTitle("Loading")

        expect.soft(playButton).toBeInTheDocument()
        expect.soft(screen.queryByText("Spinner")).toBeInTheDocument()

        act(() => {
            fireEvent.click(playButton)
        })

        expect.soft(screen.getByRole<HTMLInputElement>("slider").valueAsNumber)
            .toBe(rainviewerObj.radar.past.length - 1)
    })

    test("If a layer is taking time to load, playback will pause until it is loaded", async () => {
        vi.spyOn(L.TileLayer.prototype, "isLoading").mockReturnValue(false)
        const { result: { current: map } } = renderHook(useMap, { wrapper: Wrapper })

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const playButton = screen.getByTitle("Play")
        const slider = screen.getByRole<HTMLInputElement>("slider")

        expect.soft(screen.queryByText("Play")).toBeInTheDocument()
        
        act(() => {
            fireEvent.click(playButton)
            vi.mocked(L.TileLayer.prototype.isLoading).mockReturnValue(true)
        })

        expect.soft(screen.queryByTitle("Loading")).toBeInTheDocument()
        expect.soft(screen.queryByText("Spinner")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length)

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500)
        })

        expect.soft(screen.queryByTitle("Loading")).toBeInTheDocument()
        expect.soft(screen.queryByText("Spinner")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length)

        //Resume playback on load
        act(() => {
            vi.mocked(L.TileLayer.prototype.isLoading).mockReturnValue(false)
            map.eachLayer(layer => {
                if(layer instanceof L.LayerGroup)
                    layer.eachLayer(tileLayer => tileLayer.fire("load"))
            })
        })

        expect.soft(screen.queryByTitle("Pause")).toBeInTheDocument()
        expect.soft(screen.queryByText("Pause")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(rainviewerObj.radar.past.length + 1)
    })
})

describe("Slider", () => {
    test("Using the slider sets the current frame to the value", async () => {
        renderRainViewer()

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const slider = screen.getByRole<HTMLInputElement>("slider")

        act(() => {
            fireEvent.change(slider, { target: { value: 0 } })
        })

        expect.soft(screen.queryByText("Past: 6:10 PM")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(0)

        act(() => {
            fireEvent.change(slider, { target: { value: 1 } })
        })

        expect.soft(screen.queryByText("Past: 6:20 PM")).toBeInTheDocument()
        expect.soft(slider.valueAsNumber).toBe(1)
    })

    test("If playback is occuring, the slider will pause playback", async () => {
        renderRainViewer()

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync()
        })

        const playButton = screen.getByTitle("Play")
        const slider = screen.getByRole<HTMLInputElement>("slider")

        act(() => {
            fireEvent.click(playButton)
        })

        expect.soft(screen.queryByText("Pause")).toBeInTheDocument()

        act(() => {
            fireEvent.change(slider, { target: { value: 1 } })
        })

        expect.soft(screen.queryByText("Play")).toBeInTheDocument()
    })
})