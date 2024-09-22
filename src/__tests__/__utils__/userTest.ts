import type { UserEvent } from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";
import { test } from "vitest";


type Fixtures = {
    user: UserEvent;
};

const userTest = test.extend<Fixtures>({
    user: async ({}, use) => {
        const user = vi.isFakeTimers()
            ? userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
            : userEvent.setup();
        await use(user);
    },
});

export default userTest;
