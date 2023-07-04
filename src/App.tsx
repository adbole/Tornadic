//Components
//Contexts
import ModalContext from "Contexts/ModalContext";
import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import Daily from "Components/Daily";
import HazardLevel from "Components/HazardLevel";
import Hourly from "Components/Hourly";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import Radar from "Components/Radar";
import SunTime from "Components/SunTime";
import SimpleInfoWidget from "Components/Widget.SimpleInfo";
import Wind from "Components/Wind";
import * as WidgetIcons from "svgs/widget";


const App = () => (
    <>
        <WeatherContext>
            <ModalContext>
                <Now/>
                <Daily/>
                <Radar/>

                <Alert/>
                <Hourly/>

                <SimpleInfoWidget icon={<WidgetIcons.Droplet />} title="Precipitation" property={"precipitation"}/>
                <SimpleInfoWidget icon={<WidgetIcons.Thermometer />} title="Dewpoint" property={"dewpoint_2m"}/>
                <SimpleInfoWidget icon={<WidgetIcons.Moisture />} title="Humidity" property={"relativehumidity_2m"}/>
                <SimpleInfoWidget icon={<WidgetIcons.Eye />} title="Visibility" property={"visibility"}/>
                <HazardLevel hazard={"us_aqi"} />
                <HazardLevel hazard={"uv_index"} />
                
                <Wind/>
                <Pressure/>
                <SunTime/>
            </ModalContext>
        </WeatherContext>
    </>
);

export default App;
