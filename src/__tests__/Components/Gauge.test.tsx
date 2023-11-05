import { render, screen } from "@testing-library/react";

import Gauge from "Components/Gauge";


test("renders the provided 'gauge' and any children", () => {
    render(
        <Gauge gague={<div>Gauge</div>}>Child</Gauge>
    );

    expect.soft(screen.getByText("Child")).toBeInTheDocument();
    expect.soft(screen.getByText("Gauge")).toBeInTheDocument();
})

test("passes widget props to the Widget", () => {
    render(
        <Gauge gague={<div>Gauge</div>} widgetTitle="Title" widgetIcon={<>Icon</>}>
            Child
        </Gauge>
    )

    expect.soft(screen.getByText(/Title/)).toBeInTheDocument()
    expect.soft(screen.getByText(/Icon/)).toBeInTheDocument()
})