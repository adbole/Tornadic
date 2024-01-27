import { render, screen } from "@testing-library/react";

import Gauge from ".";


test("renders the provided 'gauge' and any children", () => {
    render(<Gauge gague={<div>Gauge</div>}>Child</Gauge>);

    expect.soft(screen.queryByText("Child")).toBeInTheDocument();
    expect.soft(screen.queryByText("Gauge")).toBeInTheDocument();
});

test("passes widget props to the Widget", () => {
    render(
        <Gauge gague={<div>Gauge</div>} widgetTitle="Title" widgetIcon={<>Icon</>}>
            Child
        </Gauge>
    );

    expect.soft(screen.queryByText(/Title/)).toBeInTheDocument();
    expect.soft(screen.queryByText(/Icon/)).toBeInTheDocument();
});
