import { geocoding } from "@test-mocks";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import LocationInput from "./LocationInput";


test("Renders an input of type search", () => {
    render(<LocationInput />);

    const input = screen.getByRole<HTMLInputElement>("searchbox");

    expect.soft(input).toBeInTheDocument();
    expect.soft(input.placeholder).toBe("Enter a location");
    expect.soft(screen.queryByRole("list")).not.toBeInTheDocument();

    cleanup();
});

test("When permissions are granted a button to use the current location is rendered", () => {
    render(<LocationInput />);

    expect(screen.queryByRole("button")).toBeInTheDocument();

    cleanup();
});

test("When permissions are granted, but geolocation isn't supported, the button isn't rendered", () => {
    vi.stubGlobal("navigator", { ...navigator, geolocation: undefined });

    render(<LocationInput />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    cleanup();
});

test("When permissions are denied the buttons isn't rendered", async () => {
    vi.mocked(navigator.permissions.query).mockResolvedValueOnce({
        state: "denied",
    } as PermissionStatus);

    render(<LocationInput />);

    expect(await screen.findByRole("button")).not.toBeInTheDocument();

    cleanup();
});

test("When the current location button is clicked, the user setting to use the current location is set", () => {
    render(<LocationInput />);

    act(() => {
        screen.getByRole("button").click();
    });

    expect(localStorage).toHaveLocalItemValue("userLocation", { useCurrent: true });

    cleanup();
});

test("When a location is typed, the results are fetched and displayed", async () => {
    render(<LocationInput />);

    act(() => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Test" } });
    });

    expect.soft(await screen.findByRole("list")).toBeInTheDocument();
    expect.soft(screen.getAllByRole("listitem")).toHaveLength(2);

    //All non-US results are filtered out
    const US = geocoding.results.filter(result => result.country_code === "US");
    const nonUS = geocoding.results.filter(result => result.country_code !== "US");

    US.forEach(result => {
        const regex = new RegExp(`${result.latitude}, ${result.longitude}`);
        expect.soft(screen.queryByText(regex)).toBeInTheDocument();
    });

    nonUS.forEach(result => {
        const regex = new RegExp(`${result.latitude}, ${result.longitude}`);
        expect.soft(screen.queryByText(regex)).not.toBeInTheDocument();
    });
});

test("When a location is selected, the user setting is set", async () => {
    render(<LocationInput />);

    act(() => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Test" } });
    });

    expect.soft(await screen.findByRole("list")).toBeInTheDocument();

    act(() => {
        screen.getAllByRole("listitem")[0].click();
    });

    expect(localStorage).toHaveLocalItemValue("userLocation", {
        coords: {
            latitude: geocoding.results[0].latitude,
            longitude: geocoding.results[0].longitude,
        },
        useCurrent: false,
    });
});
