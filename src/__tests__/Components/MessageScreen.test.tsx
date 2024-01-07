import { render } from "@testing-library/react";

import { MessageScreen } from "Components";

import { mediaQueries, varNames } from "ts/StyleMixins";


vi.mock("svgs/icon", () => ({ Tornadic: () => <p>Tornadic</p> }));

test("Matches snapshot", () => {
    const { container } = render(<MessageScreen>Test</MessageScreen>);

    expect.soft(container).toMatchSnapshot();
});

describe("Responsive", () => {
    test("By default, the svg is 500px", () => {
        const { container } = render(<MessageScreen>Test</MessageScreen>);

        expect.soft(container.firstChild).toHaveStyleRule(varNames.svgSize, "500px");
    });

    test("When the screen is small, the svg is 300px", () => {
        const { container } = render(<MessageScreen>Test</MessageScreen>);

        expect
            .soft(container.firstChild)
            .toHaveStyleRule(varNames.svgSize, "300px", { media: mediaQueries.max("small") });
    });
});
