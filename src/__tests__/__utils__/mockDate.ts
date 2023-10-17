import { apiOpenMeteo } from "__tests__/__mocks__";



export default function mockDate() {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(apiOpenMeteo.current_weather.time);
    })

    afterEach(() => {
        vi.useRealTimers();
    })
}