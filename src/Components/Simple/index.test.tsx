import { useWeather } from "@test-mocks";
import { mockDate, setLocalStorageItem } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { trunc } from "ts/Helpers";

import Simple from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);
});

const props: [ChartViews, Function][] = [
    ["dewpoint_2m", Math.round],
    ["precipitation", trunc],
    ["relativehumidity_2m", Math.round],
    ["surface_pressure", Math.round],
    ["temperature_2m", Math.round],
    ["uv_index", Math.round],
    ["visibility", Math.round],
    ["windspeed_10m", Math.round],
];

test.each(props)("%s", (prop, roundingMethod) => {
    const weather = useWeather().weather;

    render(<Simple property={prop} title="MyTitle" icon={<p>MyIcon</p>} />);

    expect.soft(screen.queryByText("MyTitle")).toBeInTheDocument();
    expect.soft(screen.queryByText("MyIcon")).toBeInTheDocument();
    expect
        .soft(
            screen.queryByText(
                roundingMethod(weather.getForecast(prop)) + weather.getForecastUnit(prop)
            )
        )
        .toBeInTheDocument();

    act(() => {
        fireEvent.click(screen.getByText("MyIcon"));
    });

    const selected = screen
        .getAllByRole<HTMLOptionElement>("option")
        .find(option => option.selected);

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();

    //Verifies that the first day is selected
    expect.soft(screen.getAllByLabelText(/.+?/)[0]).toBeChecked();
    expect.soft(selected!.value).toBe(prop);
});

test("precipitation uses Math.round when userSettings.precipitation is not inch", () => {
    setLocalStorageItem("userSettings", { ...DEFAULTS.userSettings, precipitation: "mm" });

    const weather = useWeather().weather;

    render(<Simple property="precipitation" title="MyTitle" icon={<p>MyIcon</p>} />);

    expect(
        screen.queryByText(
            Math.round(weather.getForecast("precipitation")) +
                weather.getForecastUnit("precipitation")
        )
    ).toBeInTheDocument();
});
