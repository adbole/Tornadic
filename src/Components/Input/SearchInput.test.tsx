import testIds from "@test-consts/testIDs";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import type { SearchResult } from "./SearchInput";
import SearchInput from "./SearchInput";


const onGetResults: (query: string) => Promise<SearchResult<string>[]> = vi.fn(query => {
    return Promise.resolve([
        {
            key: 1,
            label: query,
            payload: "Payload 1",
        },
        {
            key: 2,
            label: query,
            payload: "Payload 2",
        },
    ]);
});

beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(onGetResults).mockClear();
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
});

test("Renders an input of type search", () => {
    render(<SearchInput placeHolder="Enter something" onGetResults={vi.fn()} onSelect={vi.fn()} />);

    const input = screen.getByRole<HTMLInputElement>("searchbox");

    expect.soft(input).toBeInTheDocument();
    expect.soft(input.placeholder).toBe("Enter something");
    expect.soft(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("Children are rendered", () => {
    render(
        <SearchInput onGetResults={vi.fn()} onSelect={vi.fn()}>
            <div data-testid="test-child" />
        </SearchInput>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
});

test("When the input is changed, the onGetResults function is called after a delay", () => {
    render(<SearchInput onGetResults={onGetResults} onSelect={vi.fn()} />);

    act(() => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "test" } });
        vi.advanceTimersByTime(1000);
    });

    expect.soft(onGetResults).toHaveBeenCalledWith("test");
    expect.soft(onGetResults).toHaveBeenCalledOnce();

    cleanup();
});

test("When the input is changed during the delay, it is reset", () => {
    render(<SearchInput onGetResults={onGetResults} onSelect={vi.fn()} />);

    act(() => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "test" } });
        vi.advanceTimersByTime(500);
    });

    expect.soft(onGetResults).not.toHaveBeenCalled();

    act(() => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "test2" } });
        vi.advanceTimersByTime(500);
    });

    expect.soft(onGetResults).not.toHaveBeenCalled();

    act(() => {
        vi.advanceTimersByTime(500);
    });

    expect.soft(onGetResults).toHaveBeenCalledWith("test2");
    expect.soft(onGetResults).toHaveBeenCalledOnce();

    //With onGetResults called the skeletons will be shown. Below tests will test the results
    expect.soft(screen.getAllByTestId(testIds.SearchInput.Skeleton)).toHaveLength(5);

    cleanup();
});

test("When the onGetResults function returns results, they are displayed", async () => {
    render(<SearchInput onGetResults={onGetResults} onSelect={vi.fn()} />);

    await act(async () => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "test" } });
        await vi.runOnlyPendingTimersAsync();
    });

    expect.soft(screen.queryByRole("list")).toBeInTheDocument();
    expect.soft(screen.queryAllByText("test")).toHaveLength(2);
});

test("When the onGetResults function returns no results, a message is displayed", async () => {
    vi.mocked(onGetResults).mockResolvedValueOnce([]);

    render(<SearchInput onGetResults={onGetResults} onSelect={vi.fn()} />);

    await act(async () => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "test" } });
        await vi.runOnlyPendingTimersAsync();
    });

    expect.soft(screen.queryByText("No Results")).toBeInTheDocument();
});

test("Clicking a result calls the onSelect function with the payload", async () => {
    const onSelect = vi.fn();

    render(<SearchInput onGetResults={onGetResults} onSelect={onSelect} />);

    await act(async () => {
        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "test" } });
        await vi.runOnlyPendingTimersAsync();
    });

    act(() => {
        fireEvent.click(screen.getAllByRole("listitem")[0]);
    });

    expect.soft(onSelect).toHaveBeenCalledOnce();
    expect.soft(onSelect).toHaveBeenLastCalledWith("Payload 1");

    act(() => {
        fireEvent.click(screen.getAllByRole("listitem")[1]);
    });

    expect.soft(onSelect).toHaveBeenCalledTimes(2);
    expect.soft(onSelect).toHaveBeenLastCalledWith("Payload 2");
});
