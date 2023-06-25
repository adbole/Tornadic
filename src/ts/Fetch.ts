/**
 * Makes a request to the given url (supports strings and URL objects) and an error message. Await to get data
*/
export async function fetchData<T>(url: string | URL, onErrorMessage: string) {
    return fetch(url)
           .then((response) => response.ok ? response.json() : Promise.reject(onErrorMessage))
           .then((data: T) => data);
}

export type FetchResponse<T> = {
    data: T
    headers: Headers
}
/**
 * Makes a request to the given url (supports strings and URL objects) and an error message. Await to get data and headers
*/
export async function fetchDataAndHeaders<T>(url: string | URL, onErrorMessage: string): Promise<FetchResponse<T>>{
    const response = await fetch(url);

    if(response.ok) {
        const data: T = await response.json();

        return {
            data,
            headers: response.headers
        };
    }
    else {
        return Promise.reject(onErrorMessage);
    }
}