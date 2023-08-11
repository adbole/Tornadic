import { usePeekWeather } from "./PeekContext"


export default function Now() {
    const { weather } = usePeekWeather()

    const {
        temperature,
        feelsLike,
        conditionInfo
    } = weather.getNow()

    return (
        <div className={`peek-now ${conditionInfo.background}`}>
            <p>{weather.point.properties.relativeLocation.properties.city}</p>
            <h1>{temperature}</h1>
            <p>{conditionInfo.intensity} {conditionInfo.type}</p>
            <p>Feels like {feelsLike}</p>
        </div>
    )
}