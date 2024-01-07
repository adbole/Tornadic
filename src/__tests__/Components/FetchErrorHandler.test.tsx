import { act } from "react-dom/test-utils";
import { render, screen } from "@testing-library/react";
import useSWR, { SWRConfig } from "swr";

import FetchErrorHandler from "Components/FetchErrorHandler";


beforeEach(() => {
    vi.useFakeTimers()
})

afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers();
})

function TestComponent() {
    useSWR("test", () => fetch("test").then(res => res.json()))

    return <div>TestComponent</div>
}

function TestComponentMulti() {
    useSWR("one", () => fetch("one").then(res => res.json()))
    useSWR("two", () => fetch("two").then(res => res.json()))

    return <div>MultiTestComponent</div>
}

const errorRender = (hasError: boolean, retry: () => void ) => {
    return (
        <div>
            <p>Error: {hasError.toString()}</p>
            <button onClick={retry}>Retry</button>
        </div>
    )

}

const renderComponent = () => render(
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map(), shouldRetryOnError: false }}>
        <FetchErrorHandler errorRender={errorRender}>
            <TestComponent />
        </FetchErrorHandler>
    </SWRConfig>
)

test("Does not show error if no error has occurred", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}))

    renderComponent()

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    })

    expect.soft(screen.queryByText("Error: false")).toBeInTheDocument()
    expect.soft(screen.queryByText("TestComponent")).toBeInTheDocument()
})

test("Shows error if an error has occurred", async () => {
    fetchMock.mockRejectOnce()

    renderComponent()

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    })

    expect.soft(screen.queryByText("Error: true")).toBeInTheDocument()
    expect.soft(screen.queryByText("TestComponent")).toBeInTheDocument()
})

test("Retry function recalls the fetch with the same key", async () => {
    fetchMock.mockRejectOnce()

    renderComponent()

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    fetchMock.mockResponseOnce(JSON.stringify({}))

    await act(async () => {
        screen.getByText("Retry").click()
        await vi.runOnlyPendingTimersAsync();
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
})

test("Retry function does nothing if no errors occurred", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}))

    renderComponent()

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    })

    expect(fetchMock).toHaveBeenCalledOnce()

    await act(async () => {
        screen.getByText("Retry").click()
        await vi.runOnlyPendingTimersAsync();
    })

    expect(fetchMock).toHaveBeenCalledOnce()
})

test("Can handle multiple fails from multiple fetches and retry them", async () => {
    fetchMock.mockReject()

    render(
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map(), shouldRetryOnError: false }}>
            <FetchErrorHandler errorRender={errorRender}>
                <TestComponentMulti />
            </FetchErrorHandler>
        </SWRConfig>
    )

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)

    await act(async () => {
        screen.getByText("Retry").click()
        await vi.runOnlyPendingTimersAsync();
    })

    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect.soft(fetchMock.requests().filter(req => req.url === "one").length).toBe(2)
    expect.soft(fetchMock.requests().filter(req => req.url === "two").length).toBe(2)
})