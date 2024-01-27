import { setLocalStorageItem } from "@test-utils";

import { render } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Legend } from ".";


describe("Radar", () => {
    test.each([
        ["Black and White", 0],
        ["Original", 1],
        ["Universal blue", 2],
        ["TITAN", 3],
        ["The Weather Channel", 4],
        ["Meteored", 5],
        ["NEXRAD Level III", 6],
        ["Rainbow @ SELEX-SI", 7],
        ["Dark Sky", 8],
    ])("%s", (_, colorScheme) => {
        setLocalStorageItem("radarSettings", {
            ...DEFAULTS.radarSettings,
            colorScheme,
        });
        const { container } = render(<Legend />);

        expect(container).toMatchSnapshot();
    });
});

describe("Snow", () => {
    test.each([
        ["Black and White", 0],
        ["Other", 1],
    ])(`%s`, (_, colorScheme) => {
        setLocalStorageItem("radarSettings", {
            ...DEFAULTS.radarSettings,
            colorScheme,
            snow: true,
        });
        const { container } = render(<Legend />);

        expect(container).toMatchSnapshot();
    });
});
