import { Tornadic, WifiOff } from "./svgs/svgs";

const OfflineApp = () => (
    <>
        <div id="offline">
            <Tornadic />
            <div>
                <WifiOff/>
                <p>Tornadic requires an internet connection to function properly</p>
            </div>
        </div>
    </>
);

export default OfflineApp;