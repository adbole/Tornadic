import { GetCurrentTime, MeasuredValues } from "../Components/NWSContext"

export default class NWSValueSearcher {
    static GetCurrentValue(values: MeasuredValues) {
        for(const value of values.values) {
            if(value.validTime.getTime() === GetCurrentTime()) {
                return value.value;
            }
        }
    }

    static * GetFutureValues(values: MeasuredValues) {
        for(const value of values.values) {
            if(value.validTime.getTime() > GetCurrentTime()) {
                yield value
            }
        }
    }
}