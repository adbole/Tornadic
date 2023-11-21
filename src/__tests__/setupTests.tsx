import {
    airquality,
    apiWeatherGov_points,
    forecast,
    singleAlert
} from "__tests__/__mocks__"
import { createSerializer } from "@emotion/jest"
import type { Mock } from "vitest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import "vitest-canvas-mock";
import "@testing-library/jest-dom/vitest";


expect.addSnapshotSerializer(createSerializer());

// Fetch Mocks
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
    fetchMocker.mockResponse((req) => {
        if(req.url.match(/air-quality-api.open-meteo.com/))
            return JSON.stringify(airquality())
        else if(req.url.match(/api\.open-meteo\.com/))
            return JSON.stringify(forecast())   
        else if(req.url.match(/^https:\/\/api.weather.gov\/alerts\/active\/.*$/))
            return { body: JSON.stringify(singleAlert), headers: { expires: new Date().toISOString() } }
        else if(req.url.match(/^https:\/\/api.weather.gov\/points\/.*$/))
            return JSON.stringify(apiWeatherGov_points)
       
        return { status: 404 }
    })

    localStorage.clear();
})

afterEach(() => {
    fetchMocker.resetMocks();
});

//Navigator Mocks
beforeEach(() => {
    vi.stubGlobal("navigator", {
        ...navigator,
        onLine: true,
        permissions: { query: vi.fn().mockImplementation(() => Promise.resolve({ state: "granted" } as PermissionStatus)) },
        geolocation: { getCurrentPosition: vi.fn().mockImplementation((cb) => cb({ coords: { latitude: 1, longitude: 1 } })) }
    });
})

//Animation Frame Mocks
beforeEach(() => {
    let count = 0;

    vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb(performance.now() + ++count * 100) as any);
})

afterEach(() => {
    (window.requestAnimationFrame as Mock).mockRestore();
})

//Dialog Mocks
beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });

    vi.stubGlobal("ResizeObserver", vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
    })))
})

afterEach(() => {
    (HTMLDialogElement.prototype.showModal as Mock).mockRestore();
})

afterEach(() => {
    vi.unstubAllGlobals();
});

vi.mock("recharts", async (importOriginal) => ({
    ...(await importOriginal() as any),
    ResponsiveContainer: (props: any) => <div {...props} />,
}))