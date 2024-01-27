import { useWeather } from "@test-mocks";
import { mockDate, setLocalStorageItem } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import type { ChartViews } from "Components/Modals/Chart";

import Simple from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);
});

const props: Array<ChartViews> = [
    "dewpoint_2m",
    "precipitation",
    "relativehumidity_2m",
    "surface_pressure",
    "temperature_2m",
    "uv_index",
    "visibility",
    "windspeed_10m",
];

test.each(props)("%s", prop => {
    const weather = useWeather().weather;

    render(<Simple property={prop} title="MyTitle" icon={<p>MyIcon</p>} />);

    expect.soft(screen.queryByText("MyTitle")).toBeInTheDocument();
    expect.soft(screen.queryByText("MyIcon")).toBeInTheDocument();
    expect
        .soft(
            screen.queryByText(weather.getForecast(prop).toFixed(0) + weather.getForecastUnit(prop))
        )
        .toBeInTheDocument();

    act(() => {
        fireEvent.click(screen.getByText("MyIcon"));
    });

    const selected = screen
        .getAllByRole<HTMLOptionElement>("option")
        .find(option => option.selected);

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(screen.getAllByLabelText(/.+?/)[0]).toBeChecked();
    expect.soft(selected!.value).toBe(prop);
});
