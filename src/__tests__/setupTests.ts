import { cleanup } from "@testing-library/react";
import type { Mock } from "vitest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import airQualityOpenMeteo from "./__mocks__/air-quality-api.open-meteo";
import apiOpenMeteo from "./__mocks__/api.open-meteo";
import apiWeatherGov_alerts from "./__mocks__/api.weather.gov_alerts";
import apiWeatherGov_points from "./__mocks__/api.weather.gov_points";

import "@testing-library/jest-dom/vitest";


const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// @ts-expect-error with readonly assignment
navigator.permissions = { query: vi.fn() }

// @ts-expect-error with readonly assignment
navigator.geolocation = { getCurrentPosition: vi.fn() }

beforeAll(() => {
    (navigator.permissions.query as Mock).mockImplementation(() => Promise.resolve({ state: "granted" } as PermissionStatus));
    (navigator.geolocation.getCurrentPosition as Mock).mockImplementation((cb) => cb({ coords: { latitude: 1, longitude: 1 } }));
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb(performance.now()) as any);
})

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

afterAll(() => {
    (window.requestAnimationFrame as Mock).mockRestore();
})

afterEach(() => {
    fetchMocker.resetMocks();
    cleanup();
});