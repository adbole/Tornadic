//Components
//Contexts
import ModalContext from "Contexts/ModalContext";
import WeatherContext from "Contexts/WeatherContext";

import Alert from "Components/Alert";
import Daily from "Components/Daily";
import Hourly from "Components/Hourly";
import Now from "Components/Now";
import Pressure from "Components/Pressure";
import Radar from "Components/Radar";
import { AirUV, DayValues } from "Components/SimpleComponents";
import SunTime from "Components/SunTime";
import Wind from "Components/Wind";


const App = () => (
    <>
        <WeatherContext>
            <ModalContext>
                <Now/>
                <Daily/>
                <Radar/>

                <Alert/>
                <Hourly/>

                <DayValues/>
                <AirUV/>
                <Wind/>
                <Pressure/>
                <SunTime/>
            </ModalContext>
        </WeatherContext>
    </>
);

export default App;
