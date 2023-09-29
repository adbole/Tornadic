import { cleanup } from "@testing-library/react";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import airQualityOpenMeteo from "./__mocks__/air-quality-api.open-meteo";
import apiOpenMeteo from "./__mocks__/api.open-meteo";
import apiWeatherGov_alerts from "./__mocks__/api.weather.gov_alerts";
import apiWeatherGov_points from "./__mocks__/api.weather.gov_points";


const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

/* @ts-ignore */
navigator.permissions = { query: () => Promise.resolve({ state: "granted" } as PermissionStatus) }

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
