import {
    airquality,
    apiWeatherGov_points,
    forecast,
    geocoding,
    rainviewer,
    singleAlert,
} from "@test-mocks";

import { createSerializer, matchers } from "@emotion/jest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import "vitest-canvas-mock";
import "@testing-library/jest-dom/vitest";

//@ts-expect-error
global.IS_REACT_ACT_ENVIRONMENT = true;

expect.addSnapshotSerializer(createSerializer());
// @ts-expect-error with matchers type not being compatible
expect.extend(matchers);

// Fetch Mocks
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
    fetchMocker.mockResponse(req => {
        if (req.url.match(/air-quality-api.open-meteo.com/)) return JSON.stringify(airquality());
        else if (req.url.match(/geocoding-api.open-meteo.com/)) return JSON.stringify(geocoding);
        else if (req.url.match(/api\.open-meteo\.com/)) return JSON.stringify(forecast());
        else if (req.url.match(/^https:\/\/api.weather.gov\/alerts\/active\/.*$/))
            return {
                body: JSON.stringify(singleAlert),
                headers: { expires: new Date().toISOString() },
            };
        else if (req.url.match(/^https:\/\/api.weather.gov\/points\/.*$/))
            return JSON.stringify(apiWeatherGov_points);
        else if (req.url.match(/api.rainviewer.com/)) return JSON.stringify(rainviewer());

        return { status: 404 };
    });

    localStorage.clear();
});

afterEach(() => {
    fetchMocker.resetMocks();
});

//Navigator Mocks
beforeEach(() => {
    vi.stubGlobal("navigator", {
        ...navigator,
        onLine: true,
        permissions: {
            query: vi
                .fn()
                .mockImplementation(() =>
                    Promise.resolve({ state: "granted" } as PermissionStatus)
                ),
        },
        geolocation: {
            getCurrentPosition: vi
                .fn()
                .mockImplementation(cb => cb({ coords: { latitude: 1, longitude: 1 } })),
        },
    });
});

//Animation Frame Mocks
beforeEach(() => {
    let count = 0;

    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
        cb => cb(performance.now() + ++count * 100) as any
    );
});

afterEach(() => {
    vi.mocked(window.requestAnimationFrame).mockRestore();
});

//Dialog Mocks
beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });

    vi.stubGlobal(
        "ResizeObserver",
        vi.fn().mockImplementation(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }))
    );
});

afterEach(() => {
    vi.mocked(HTMLDialogElement.prototype.showModal).mockRestore();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

expect.extend({
    toHaveLocalItemValue<K extends keyof StorageKeysAndTypes>(
        received: Storage,
        key: K,
        value: StorageKeysAndTypes[K]
    ) {
        const pass = received.getItem(key) === JSON.stringify(value);

        return {
            message: () => `expected ${key} to${this.isNot ? " not" : ""} have value: ${value}`,
            pass,
        };
    },
});
