import { MapContainer } from "react-leaflet";
import { rainviewer } from "__tests__/__mocks__";
import { act, fireEvent, render, screen } from "@testing-library/react";
import L from "leaflet";

import { RainViewer } from "Components/Radar/__internal__";



beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
})

afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
})

vi.spyOn(L, "tileLayer")

const rainviewerObj = rainviewer()

test("Renders as expected", async () => {
    render(
        <MapContainer>
            <RainViewer />
        </MapContainer>
    )

    await act(async () => {
        await vi.runOnlyPendingTimersAsync()
    })

    expect.soft(screen.queryByText("Past: 8:10 PM")).toBeInTheDocument()
    expect.soft(screen.queryByTitle("Play")).toBeInTheDocument()
    expect.soft(screen.queryByRole("slider")).toBeInTheDocument()
    expect.soft(screen.queryByRole("slider")?.nextElementSibling?.children)
        .toHaveLength(rainviewerObj.radar.past.length + rainviewerObj.radar.nowcast.length) 
})

// test("Shows an error if the data can't be fetched", async () => {
//     fetchMock.mockReject()

//     render(
//         <MapContainer>
//             <RainViewer />
//         </MapContainer>
//     )

//     await act(async () => {
//         await vi.runOnlyPendingTimersAsync()
//     })

//     expect.soft(screen.queryByText("Could not get radar data")).toBeInTheDocument()
// })

// describe("General functionality", () => {
//     test("On render, loads the current frame and preloads the next", async () => {
//         render(
//             <MapContainer>
//                 <RainViewer />
//             </MapContainer>
//         )
    
//         await act(async () => {
//             await vi.runOnlyPendingTimersAsync()
//         })
    
//         expect.soft(L.tileLayer).toBeCalledTimes(2)
    
//         const [current, preload] = vi.mocked(L.tileLayer).mock.calls
//         const [currentResult, preloadResult] = (vi.mocked(L.tileLayer).mock.results.map(r => r.value as L.TileLayer))
    
//         expect.soft(current[0]).toContain(rainviewerObj.radar.past.slice(-1)[0].path)
//         expect.soft(currentResult.options.opacity).toBe(0.8)
    
//         expect.soft(preload[0]).toContain(rainviewerObj.radar.nowcast[0].path)
//         expect.soft(preloadResult.options.opacity).toBe(0)
//     })
    
//     test("Clicking the play button causes the next frame to preload", async () => {
//         render(
//             <MapContainer>
//                 <RainViewer />
//             </MapContainer>
//         )
    
//         await act(async () => {
//             await vi.runOnlyPendingTimersAsync()
//         })
    
//         const playButton = screen.getByTitle("Play")
        
//         act(() => {
//             fireEvent.click(playButton)
//         })
    
//         expect.soft(L.tileLayer).toBeCalledTimes(3)
    
//         const [preload] = vi.mocked(L.tileLayer).mock.calls.slice(-1)
//         const [previous, current] = (vi.mocked(L.tileLayer).mock.results.map(r => r.value as L.TileLayer))
    
//         expect.soft(preload[0]).toContain(rainviewerObj.radar.nowcast[1].path)
//         expect.soft(previous.options.opacity).toBe(0)
//         expect.soft(current.options.opacity).toBe(0.8)
//     })
    
//     test("The radar loops to the beginning when the end is reached", async () => {
//         render(
//             <MapContainer>
//                 <RainViewer />
//             </MapContainer>
//         )
    
//         await act(async () => {
//             await vi.runOnlyPendingTimersAsync()
//         })
    
//         const playButton = screen.getByTitle("Play")
        
//         act(() => {
//             fireEvent.click(playButton)
//         })
    
//         await act(async () => {
//             await vi.advanceTimersByTimeAsync(1000)
//         })
    
//         expect.soft(L.tileLayer).toHaveBeenLastCalledWith(
//             expect.stringMatching(rainviewerObj.radar.past[0].path),
//             expect.anything()
//         )
//     })
// })