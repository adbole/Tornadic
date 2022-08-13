//Provides methods to normalize a value between to values to be between 0 and 1
export default class Normalize {
    //Normalizes a value to be between 0 and 1 given it and the minimum and maximum values possible
    static Decimal(x, min, max) {
        return (x - min)/(max-min);
    }

    //Converts Decimal calculation to a percentage
    static Percent(x, min, max) {
        return Normalize.Decimal(x, min, max) * 100;
    }
}