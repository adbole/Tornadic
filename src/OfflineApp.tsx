import { Tornadic, WifiOff } from "./svgs";

const OfflineApp = () => (
    <>
        <div id="error-screen">
            <Tornadic />
            <div>
                <WifiOff/>
                <p>Tornadic requires an internet connection to function properly</p>
            </div>
        </div>
    </>
);

export default OfflineApp;