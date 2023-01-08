import { Forecast, useNWS } from './NWSContext'
import NWSValueSearcher from '../ts/NWSValueSearcher';

const Now = (props: {
    location: string,
    currentTemp: number,
    status: string,
    feelsTemp: number
}
) => {
    const nwsData = useNWS();
    const current = nwsData!.properties.temperature.values[0].value
    return (
        <div id="now">
            <p>{props.location}</p>
    
            <p id="current">{NWSValueSearcher.GetCurrentValue(nwsData!.properties.temperature)}</p>
    
            <p>{props.status}</p>
            <p>Feels like <span>{NWSValueSearcher.GetCurrentValue(nwsData!.properties.apparentTemperature)}</span>°</p>
        </div>
    )
}

export default Now;