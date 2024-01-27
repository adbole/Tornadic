import { act, render, screen } from "@testing-library/react";
import UpdateManager from "UpdateManager";


const mocks = vi.hoisted(() => ({
    useRegisterSW: vi.fn().mockReturnValue({
        needRefresh: [false, () => {}],
        updateServiceWorker: () => {}
    })
}))

vi.mock("virtual:pwa-register/react", () => ({
    useRegisterSW: mocks.useRegisterSW
}))


const renderManager = () => render(
    <>
        <div id="toast-root"/>
        <UpdateManager />
    </>
)

test("When there is no update, the toast should not be visible", () => {
    renderManager()

    expect(screen.queryByText("A new version is available!")).not.toBeInTheDocument()
})

test("When there is an update, the toast should be visible", () => {
    mocks.useRegisterSW.mockReturnValueOnce({
        needRefresh: [true, () => {}],
        updateServiceWorker: () => {}
    })

    renderManager()

    expect(screen.getByText("A new version is available!")).toBeInTheDocument()
})

test("Clicking the refresh button should call updateServiceWorker", () => {
    const updateServiceWorker = vi.fn()

    mocks.useRegisterSW.mockReturnValueOnce({
        needRefresh: [true, () => {}],
        updateServiceWorker
    })

    renderManager()

    act(() => {
        screen.getByText("Refresh").click()
    })

    expect(updateServiceWorker).toHaveBeenCalledWith(true)
})

test("Clicking the dismiss button calls setNeedRefresh with false", () => {
    const setNeedRefresh = vi.fn()
    const updateServiceWorker = vi.fn()

    mocks.useRegisterSW.mockReturnValueOnce({
        needRefresh: [true, setNeedRefresh],
        updateServiceWorker
    })

    renderManager()

    act(() => {
        screen.getByText("Dismiss").click()
    })

    expect.soft(setNeedRefresh).toHaveBeenCalledWith(false)
    expect.soft(updateServiceWorker).not.toHaveBeenCalled()
})