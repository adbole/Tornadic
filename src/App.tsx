//Components
import Now from './Components/Now';
import Hourly from './Components/Hourly';
import Daily from './Components/Daily';
import Radar from './Components/Radar/Radar';
import Wind from './Components/Wind';
import SunTime from './Components/SunTime';
import Alert from './Components/Alert/Alert';
import Pressure from './Components/Pressure';

//Contexes
import ModalContext from './Components/Contexes/ModalContext';
import WeatherContext from './Components/Contexes/WeatherContext';
import { AirUV, DayValues } from './Components/SimpleComponents';


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
