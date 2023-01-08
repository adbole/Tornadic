import React, { ReactNode } from 'react'
import Loader from './Loader'

let currentTime: Date;
export const GetCurrentTime = () => currentTime.getTime();

const NWSContext = React.createContext<Forecast | undefined>(undefined);

export const useNWS = () => {
    const context = React.useContext(NWSContext);

    if(!context) {
        console.error("Please use UseNWS inside a NWSContext provider");
        return null;
    } 
    else {
        return context;
    }
}

type Point = {
    properties: {
        gridId: string,
        gridX: number,
        gridY: number,
        forecast: string,
        forecastHourly: string,
        forecastGridData: string,
        relativeLocation: {
            properties: {
                city: string,
                state: string
            }
        }
    }
}

type MeasuredValue = {
    validTime: Date
    value: number
}

export type MeasuredValues = {
    values: MeasuredValue[]
}

export type Forecast = {
    properties: {
        validTimes: Date
        temperature: MeasuredValues
        dewpoint: MeasuredValues
        maxTemperature: MeasuredValues
        minTemperature: MeasuredValues
        relativeHumidity: MeasuredValues
        apparentTemperature: MeasuredValues
        heatIndex: MeasuredValues
        skyCover: MeasuredValues
        windDirection: MeasuredValues
        windSpeed: MeasuredValues
        probabilityOfPrecipitation: MeasuredValues
        quantitativePrecipitation: MeasuredValues
        visibility: MeasuredValues
        hainesIndex: MeasuredValues
    }
}

function AllToF(...args : MeasuredValues[]) {
    for(const arg of args) {
        for(const value of arg.values) {
            value.value = Math.round((value.value * 9/5) + 32);
        }
    }
}

function GetData(url: string, onSuccess: (t: any) => void, onErrorMessage: string) {
    fetch(url)
    .then((response) => response.ok ? response.json() : Promise.reject(onErrorMessage))
    .then((data) => onSuccess(data))
    .catch((error) => console.error(error))
}

const NWSContextProvider = (props: {children: ReactNode}) => {
    const [position, setPosition] = React.useState<GeolocationPosition>();
    const [point, setPoint] = React.useState<Point>();
    const [forecast, setForecast] = React.useState<Forecast>();
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        async function GetPosition() {
            const pos: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        
            setPosition(pos);
        }

        GetPosition();
    }, [])

    //Once the position is obtained, make a request to NWS's points endpoint to determine where to get forecast data
    React.useEffect(() => {
        if(!position) return;

        GetData(`https://api.weather.gov/points/${position.coords.latitude},${position.coords.longitude}`, setPoint, "Failed to get point data from NWS")
    }, [position])

    //Once the point data is obtianed, make a request to the gridpoint endpoint to get the forecast.
    React.useEffect(() => {
        if(!point) return;

        console.log(point.properties.forecastGridData);
        GetData(point.properties.forecastGridData, SanatizeAndSetForecast, "Failed to get gridpoint forecast data")

        //When we get the forecast data, the valid times aren't in the desired format. Because of this
        //we must loop through all the data and sanatize
        function SanatizeAndSetForecast(data: any) {
            data.properties.validTimes = new Date(data.properties.validTimes.replace(/\/.+?$/gm, ""))

            for(const prop in data.properties) {
                if(data.properties[prop].values) {
                    for(const value of data.properties[prop].values) {
                        value.validTime = new Date(value.validTime.replace(/\/.+?$/gm, ""))
                    }
                }
            }

            //Convert temperatures to fahrenheit.
            const sanatizedData = data as Forecast;
            AllToF(
                sanatizedData.properties.temperature, 
                sanatizedData.properties.minTemperature, 
                sanatizedData.properties.maxTemperature, 
                sanatizedData.properties.apparentTemperature
            )

            //Set the sanatized data
            setForecast(sanatizedData)

            currentTime = new Date();
            currentTime.setMinutes(0,0,0);
        }
    }, [point])


    React.useEffect(() => {
        if(!forecast) return;

        setReady(true);
    }, [forecast])

    return (
        <NWSContext.Provider value={forecast}>
            {ready ? props.children : <Loader />}
        </NWSContext.Provider>
    )
}

export default NWSContextProvider