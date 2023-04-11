//Components
import Now from './Components/Now';
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';
import Radar from './Components/Radar/Radar';
import HazardLevelView from './Components/HazardLevelView';
import Wind from './Components/Wind';
import SunTime from './Components/SunTime';
import Alert from './Components/Alert';
import { SimpleInfoWidget } from './Components/SimpleComponents';

//Contexes
import ModalContext from './Components/Contexes/ModalContext';
import WeatherContext, { useWeather } from './Components/Contexes/WeatherContext';
import { WeatherData } from './ts/WeatherData';

//Icons
import * as WidgetIcons from './svgs/widget/widget.svgs';
import Pressure from './Components/Pressure';
import Chart from './Components/Chart';

const DayValues = () => {
    const forecastData = useWeather().forecast;

    return (
        <>
            <SimpleInfoWidget icon={<WidgetIcons.Droplet />} title="Precipitation" value={forecastData.hourly.precipitation[forecastData.nowIndex] + forecastData.hourly_units.precipitation} />
            <SimpleInfoWidget icon={<WidgetIcons.Thermometer />} title="Dew Point" value={forecastData.hourly.dewpoint_2m[forecastData.nowIndex] + forecastData.hourly_units.dewpoint_2m} />
            <SimpleInfoWidget icon={<WidgetIcons.Moisture />} title="Humidity" value={forecastData.hourly.relativehumidity_2m[forecastData.nowIndex] + forecastData.hourly_units.relativehumidity_2m} />
            <SimpleInfoWidget icon={<WidgetIcons.Eye />} title="Visibility" value={`${forecastData.hourly.visibility[forecastData.nowIndex].toFixed(0)} ${forecastData.hourly_units.visibility}`} />
        </>
    );
};

const AirUV = () => {
    const forecastData = useWeather().forecast;
    const airqualityData = useWeather().airQuality.hourly;

    const AQ = Math.round(airqualityData.us_aqi[forecastData.nowIndex]);
    const UV = Math.round(airqualityData.uv_index[forecastData.nowIndex]);

    return (
        <>
            <HazardLevelView info={WeatherData.GetAQInfo(AQ)} />
            <HazardLevelView info={WeatherData.GetUVInfo(UV)} />
        </>
    );
};

const App = () => (
    <>
        <WeatherContext>
            <ModalContext>
                    <Now/>
                    <Alert/>
                    <Hourly />
                    <DayValues/>
                    <AirUV />
                    <Daily />
                    <Radar />
                    <Wind/>
                    <Pressure/>
                    <SunTime/>
            </ModalContext>
        </WeatherContext>
    </>
);

export default App;
