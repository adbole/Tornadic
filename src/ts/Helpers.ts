//Provides methods to normalize a value between to values to be between 0 and 1
export class Normalize {
    //Normalizes a value to be between 0 and 1 given it and the minimum and maximum values possible
    static Decimal(x: number, min: number, max: number) {
        return (x - min)/(max-min);
    }

    //Converts Decimal calculation to a percentage
    static Percent(x: number, min: number, max: number) {
        return Normalize.Decimal(x, min, max) * 100;
    }
}

/**
 * Makes a request to the given url (supports strings and URL objects) and an error message. Await to get data
*/
export async function FetchData<T>(url: string | URL, onErrorMessage: string) {
    return fetch(url)
           .then((response) => response.ok ? response.json() : Promise.reject(onErrorMessage))
           .then((data: T) => data)
           .catch((error) => { 
                console.error(error); 
                return null;
            });
}