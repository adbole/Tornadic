//Components
import Now from 'Components/Now';
import Hourly from 'Components/Hourly';
import Daily from 'Components/Daily';
import Radar from 'Components/Radar';
import Wind from 'Components/Wind';
import SunTime from 'Components/SunTime';
import Alert from 'Components/Alert';
import Pressure from 'Components/Pressure';
import { AirUV, DayValues } from 'Components/SimpleComponents';

//Contexts
import ModalContext from 'Components/Contexts/ModalContext';
import WeatherContext from 'Components/Contexts/Weather';

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
