import { cleanup } from "@testing-library/react";
import type { Mock } from "vitest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import airQualityOpenMeteo from "./__mocks__/air-quality-api.open-meteo";
import apiOpenMeteo from "./__mocks__/api.open-meteo";
import apiWeatherGov_alerts from "./__mocks__/api.weather.gov_alerts";
import apiWeatherGov_points from "./__mocks__/api.weather.gov_points";


const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// @ts-expect-error with readonly assignment
navigator.permissions = { query: vi.fn() }

// @ts-expect-error with readonly assignment
navigator.geolocation = { getCurrentPosition: vi.fn() }

beforeAll(() => {
    (navigator.permissions.query as Mock).mockImplementation(() => Promise.resolve({ state: "granted" } as PermissionStatus));
    (navigator.geolocation.getCurrentPosition as Mock).mockImplementation((cb) => cb({ coords: { latitude: 1, longitude: 1 } }));
})

beforeEach(() => {
    fetchMocker.mockResponse((req) => {
        if(req.url.match(/air-quality-api.open-meteo.com/))
            return JSON.stringify(airQualityOpenMeteo)
        else if(req.url.match(/api\.open-meteo\.com/))
            return JSON.stringify(apiOpenMeteo)
        else if(req.url.match(/^https:\/\/api.weather.gov\/alerts\/active\/.*$/))
            return JSON.stringify(apiWeatherGov_alerts)
        else if(req.url.match(/^https:\/\/api.weather.gov\/points\/.*$/))
            return JSON.stringify(apiWeatherGov_points)
       
        return { status: 404 }
    })

    localStorage.clear();
})

afterEach(() => {
    fetchMocker.resetMocks();
    cleanup();
});
