import { setLocalStorageItem } from "@test-utils";

import { act, renderHook } from "@testing-library/react";

import DataConverter from "ts/DataConverter";
import { getTimeToNextHour } from "ts/Helpers";

import useEnsemble from "./useEnsemble";
import DEFAULTS from "./useLocalStorage.config";

//Legnths are different to ensure that the data is being converted correctly
const TIME_LENGTH = 24;
const ENSEMBLE_MEMBER_LENGTH = 30;

function constructData(variable: keyof Forecast["hourly"]) {
    const data = {
        hourly: {
            time: new Array(TIME_LENGTH).fill("123"),
            [variable]: Array.from({ length: ENSEMBLE_MEMBER_LENGTH }, (_, i) => i),
        },
    };

    for (let i = 0; i < 30; i++) {
        data.hourly[`variable_member${i}`] = Array.from(
            { length: ENSEMBLE_MEMBER_LENGTH },
            (_, i) => i
        );
    }

    return data;
}

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);
});

test("Weather variable is passed correctly to the url", () => {
    renderHook(() => useEnsemble("temperature_2m", 0, 0));

    expect.soft(fetchMock).toHaveBeenCalledOnce();
    expect.soft(fetchMock.requests()[0].url).toContain("temperature_2m");
});

test("Data is converted into a more usuable format", async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(DataConverter.prototype, "convert");

    fetchMock.mockResponse(JSON.stringify(constructData("temperature_2m")));

    const { result } = renderHook(() => useEnsemble("temperature_2m", 0, 0));

    await act(async () => {
        await vi.advanceTimersToNextTimerAsync();
    });

    //Data converter should have been used on each member data
    //where the members should have been array of length 24 with numbers
    expect.soft(spy).toHaveBeenCalledTimes(31);
    expect
        .soft(spy)
        .toHaveBeenCalledWith(
            "temperature_2m",
            Array(ENSEMBLE_MEMBER_LENGTH).fill(expect.any(Number))
        );

    //Members were converted successfully if time is separated and all
    //30 extra members plus the first are gathered into the data array
    expect.soft(result.current.ensemble!.time).toHaveLength(24);
    expect.soft(result.current.ensemble!.data).toHaveLength(31);
    expect
        .soft(result.current.ensemble!.data.every(x => x.length === ENSEMBLE_MEMBER_LENGTH))
        .toBeTruthy();

    vi.useRealTimers();
});

test("Data is refreshed at next hour", async () => {
    vi.useFakeTimers();

    fetchMock.mockResponse(JSON.stringify(constructData("temperature_2m")));
    renderHook(() => useEnsemble("temperature_2m", 0, 0));

    expect.soft(fetchMock).toHaveBeenCalledOnce();

    await act(async () => {
        await vi.advanceTimersByTimeAsync(getTimeToNextHour());
    });

    expect.soft(fetchMock).toHaveBeenCalledTimes(2);

    await act(async () => {
        await vi.advanceTimersByTimeAsync(getTimeToNextHour());
    });

    expect.soft(fetchMock).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
});
