import { forecast } from "__tests__/__mocks__";


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
