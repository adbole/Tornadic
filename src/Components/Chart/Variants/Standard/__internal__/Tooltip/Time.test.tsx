import { render, screen } from "@testing-library/react";

import Chart from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";

import getTimeFormatted from "ts/TimeConversion";

import { Time } from ".";


vi.mock("Components/Chart/Components");

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [i],
}));

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Chart dataPoints={dataPoints} type="linear">
            {children}
        </Chart>
    );
}

test("When given hoverIndex -1 and day 0, shows Now", () => {
    vi.mocked(useTooltip).mockReturnValue(-1);

    render(
        <Wrapper>
            <Time day={0} />
        </Wrapper>
    );

    expect(screen.getByText("Now")).toBeInTheDocument();
});

test("Shows 'Min and Max' when given day > 0", () => {
    vi.mocked(useTooltip).mockReturnValue(-1);

    render(
        <Wrapper>
            <Time day={1} />
        </Wrapper>
    );

    expect(screen.getByText("Min and Max")).toBeInTheDocument();
});

test("Shows time when given hoverIndex > -1", () => {
    vi.mocked(useTooltip).mockReturnValue(1);

    const time = getTimeFormatted(dataPoints[1].x, "hourMinute");

    render(
        <Wrapper>
            <Time day={0} />
        </Wrapper>
    );

    expect(screen.getByText(time)).toBeInTheDocument();
});
