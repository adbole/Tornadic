import { forecast } from "@test-mocks";


export default function mockDate() {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(forecast().current_weather.time);
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });
}
