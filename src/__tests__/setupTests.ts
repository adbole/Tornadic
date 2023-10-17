import { cleanup } from "@testing-library/react";
import type { Mock } from "vitest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import airQualityOpenMeteo from "./__mocks__/air-quality-api.open-meteo";
import apiOpenMeteo from "./__mocks__/api.open-meteo";
import apiWeatherGov_alerts from "./__mocks__/api.weather.gov_alerts";
import apiWeatherGov_points from "./__mocks__/api.weather.gov_points";

import "@testing-library/jest-dom/vitest";

// Fetch Mocks
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
    fetchMocker.mockResponse((req) => {
        if(req.url.match(/air-quality-api.open-meteo.com/))
            return JSON.stringify(airQualityOpenMeteo)
        else if(req.url.match(/api\.open-meteo\.com/))
            return JSON.stringify(apiOpenMeteo)   
        else if(req.url.match(/^https:\/\/api.weather.gov\/alerts\/active\/.*$/))
            return { body: JSON.stringify(apiWeatherGov_alerts), headers: { expires: new Date().toISOString() } }
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
        permissions: { query: vi.fn() },
        geolocation: { getCurrentPosition: vi.fn() }
    });

    (navigator.permissions.query as Mock).mockImplementation(() => Promise.resolve({ state: "granted" } as PermissionStatus));
    (navigator.geolocation.getCurrentPosition as Mock).mockImplementation((cb) => cb({ coords: { latitude: 1, longitude: 1 } }));
})

afterEach(() => {
    vi.unstubAllGlobals();
});

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
})

afterEach(() => {
    (HTMLDialogElement.prototype.showModal as Mock).mockRestore();
})