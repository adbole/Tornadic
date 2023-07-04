import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import { Widget } from "Components/SimpleComponents";
import { Wind as WindIcon } from "svgs/widget";


/**
 * Generates an array of SVG rects to be added to the Wind component's SVG to help indicate 45 degree increments
 * @returns An array of SVG rects
 */
function generateAngledStamps() {
    const angle = 45;
    const numOfIncrements = 360 / angle; 

    const rects = [];

    for(let i = 0; i < numOfIncrements; ++i) {
        rects.push(<rect key={i} className="origin-center" style={{ transform: `rotate(${angle * i}deg)` }} width="1.5" height="5" x="49.25" y="1" />);
    }

    return rects;
}

/**
 * Displays the current windspeed in text along with the wind direction using an svg
 * @returns The Wind widget
 */
const Wind = () => {
    const { weather } = useWeather();
    const { showModal } = useModal();

    return (
        <Widget id="wind" widgetTitle="Wind" widgetIcon={<WindIcon/>} onClick={() => showModal(<Chart showView={"windspeed_10m"}/>)}>
            <div>
                <svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#fff" fillOpacity=".5" d="m50 0.045722a50 49.977 0 0 0-50 49.977 50 49.977 0 0 0 50 49.977 50 49.977 0 0 0 50-49.977 50 49.977 0 0 0-50-49.977zm0 6.2473a43.75 43.73 0 0 1 1.1265 0.014206 43.75 43.73 0 0 1 1.1259 0.043907 43.75 43.73 0 0 1 1.124 0.072319 43.75 43.73 0 0 1 1.122 0.10136 43.75 43.73 0 0 1 1.1188 0.12978 43.75 43.73 0 0 1 1.1156 0.15948 43.75 43.73 0 0 1 1.1104 0.18723 43.75 43.73 0 0 1 1.1059 0.2163 43.75 43.73 0 0 1 1.0994 0.2447 43.75 43.73 0 0 1 1.0936 0.27247 43.75 43.73 0 0 1 1.0852 0.30087 43.75 43.73 0 0 1 1.0775 0.32864 43.75 43.73 0 0 1 1.069 0.35576 43.75 43.73 0 0 1 1.0587 0.38416 43.75 43.73 0 0 1 1.049 0.41063 43.75 43.73 0 0 1 1.038 0.43776 43.75 43.73 0 0 1 1.0264 0.46358 43.75 43.73 0 0 1 1.0141 0.4907 43.75 43.73 0 0 1 1.0012 0.51652 43.75 43.73 0 0 1 0.98766 0.5417 43.75 43.73 0 0 1 0.97281 0.56753 43.75 43.73 0 0 1 0.95858 0.59207 43.75 43.73 0 0 1 0.94245 0.6166 43.75 43.73 0 0 1 0.92695 0.64049 43.75 43.73 0 0 1 0.9095 0.66374 43.75 43.73 0 0 1 0.89207 0.68762 43.75 43.73 0 0 1 0.87462 0.71022 43.75 43.73 0 0 1 0.85523 0.73218 43.75 43.73 0 0 1 0.83716 0.75412 43.75 43.73 0 0 1 0.81648 0.77608 43.75 43.73 0 0 1 0.79646 0.7961 43.75 43.73 0 0 1 0.77578 0.81611 43.75 43.73 0 0 1 0.75447 0.83612 43.75 43.73 0 0 1 0.73316 0.8555 43.75 43.73 0 0 1 0.71055 0.87422 43.75 43.73 0 0 1 0.6873 0.89165 43.75 43.73 0 0 1 0.66469 0.90908 43.75 43.73 0 0 1 0.64078 0.92652 43.75 43.73 0 0 1 0.61688 0.94201 43.75 43.73 0 0 1 0.59234 0.9575 43.75 43.73 0 0 1 0.5678 0.973 43.75 43.73 0 0 1 0.54195 0.98721 43.75 43.73 0 0 1 0.51676 1.0007 43.75 43.73 0 0 1 0.49029 1.0136 43.75 43.73 0 0 1 0.46444 1.0259 43.75 43.73 0 0 1 0.43796 1.0369 43.75 43.73 0 0 1 0.41082 1.0485 43.75 43.73 0 0 1 0.3837 1.0589 43.75 43.73 0 0 1 0.35656 1.0679 43.75 43.73 0 0 1 0.3288 1.0776 43.75 43.73 0 0 1 0.30101 1.0847 43.75 43.73 0 0 1 0.27259 1.0924 43.75 43.73 0 0 1 0.24482 1.0996 43.75 43.73 0 0 1 0.21639 1.1047 43.75 43.73 0 0 1 0.18732 1.1105 43.75 43.73 0 0 1 0.15892 1.1151 43.75 43.73 0 0 1 0.13047 1.1183 43.75 43.73 0 0 1 0.10137 1.1215 43.75 43.73 0 0 1 0.0724 1.1235 43.75 43.73 0 0 1 0.0439 1.1254 43.75 43.73 0 0 1 0.0143 1.126 43.75 43.73 0 0 1-0.12211 3.2677 43.75 43.73 0 0 1-0.36625 3.2496 43.75 43.73 0 0 1-0.60848 3.2134 43.75 43.73 0 0 1-0.84685 3.1586 43.75 43.73 0 0 1-1.0807 3.0869 43.75 43.73 0 0 1-1.3081 2.9971 43.75 43.73 0 0 1-1.529 2.8913 43.75 43.73 0 0 1-1.7408 2.7692 43.75 43.73 0 0 1-1.9424 2.6311 43.75 43.73 0 0 1-2.1342 2.4787 43.75 43.73 0 0 1-2.3138 2.3127 43.75 43.73 0 0 1-2.4798 2.1332 43.75 43.73 0 0 1-2.6323 1.9415 43.75 43.73 0 0 1-2.7705 1.74 43.75 43.73 0 0 1-2.8926 1.5283 43.75 43.73 0 0 1-2.9985 1.3075 43.75 43.73 0 0 1-3.0883 1.0802 43.75 43.73 0 0 1-3.16 0.84645 43.75 43.73 0 0 1-3.2149 0.60821 43.75 43.73 0 0 1-3.2511 0.36608 43.75 43.73 0 0 1-3.2692 0.12203 43.75 43.73 0 0 1-3.2692-0.12203 43.75 43.73 0 0 1-3.2517-0.36608 43.75 43.73 0 0 1-3.2143-0.60821 43.75 43.73 0 0 1-3.1607-0.84645 43.75 43.73 0 0 1-3.0877-1.0802 43.75 43.73 0 0 1-2.9992-1.3075 43.75 43.73 0 0 1-2.8926-1.5283 43.75 43.73 0 0 1-2.7698-1.74 43.75 43.73 0 0 1-2.6329-1.9415 43.75 43.73 0 0 1-2.4798-2.1332 43.75 43.73 0 0 1-2.3132-2.3127 43.75 43.73 0 0 1-2.1342-2.4787 43.75 43.73 0 0 1-1.943-2.6311 43.75 43.73 0 0 1-1.7402-2.7692 43.75 43.73 0 0 1-1.529-2.8913 43.75 43.73 0 0 1-1.308-2.9971 43.75 43.73 0 0 1-1.0807-3.0869 43.75 43.73 0 0 1-0.84685-3.1586 43.75 43.73 0 0 1-0.60849-3.2134 43.75 43.73 0 0 1-0.36626-3.2496 43.75 43.73 0 0 1-0.12211-3.2677 43.75 43.73 0 0 1 0.12211-3.2677 43.75 43.73 0 0 1 0.36626-3.2502 43.75 43.73 0 0 1 0.60849-3.2128 43.75 43.73 0 0 1 0.84685-3.1592 43.75 43.73 0 0 1 1.0807-3.0862 43.75 43.73 0 0 1 1.308-2.9978 43.75 43.73 0 0 1 1.529-2.8913 43.75 43.73 0 0 1 1.7402-2.7685 43.75 43.73 0 0 1 1.943-2.6317 43.75 43.73 0 0 1 2.1342-2.4787 43.75 43.73 0 0 1 2.3132-2.3121 43.75 43.73 0 0 1 2.4798-2.1332 43.75 43.73 0 0 1 2.6329-1.9421 43.75 43.73 0 0 1 2.7698-1.7394 43.75 43.73 0 0 1 2.8926-1.5283 43.75 43.73 0 0 1 2.9992-1.3075 43.75 43.73 0 0 1 3.0877-1.0802 43.75 43.73 0 0 1 3.1607-0.84645 43.75 43.73 0 0 1 3.2143-0.60821 43.75 43.73 0 0 1 3.2517-0.36609 43.75 43.73 0 0 1 3.2692-0.12204z"/>
                        
                    <g fill="white">
                        {generateAngledStamps()}
                    </g>
    
                    <g style={{ transformOrigin: "center", transform: `rotate(${180 + weather.getForecast("winddirection_10m")}deg)` }}>
                        <path fill="#0078ef" d="m49.998 4.9612e-4a49.453 50.022 0 0 0-3.0827 0.10921 49.453 50.022 0 0 0-0.82737 0.06204 49.453 50.022 0 0 0-2.525 0.26754 49.453 50.022 0 0 0-0.60248 0.075608 49.453 50.022 0 0 0-3.0066 0.53637 49.453 50.022 0 0 0-0.70343 0.16027 49.453 50.022 0 0 0-2.4092 0.60747 49.453 50.022 0 0 0-0.74367 0.20809 49.453 50.022 0 0 0-2.9076 0.95514 49.453 50.022 0 0 0-0.10414 0.040717l2.1148 5.877a43.272 43.769 0 0 1 0.50537-0.19 43.272 43.769 0 0 1 1.5371-0.51182 43.272 43.769 0 0 1 1.5551-0.45301 43.272 43.769 0 0 1 1.571-0.39421 43.272 43.769 0 0 1 1.5839-0.33475 43.272 43.769 0 0 1 1.5954-0.27401 43.272 43.769 0 0 1 1.6049-0.21391 43.272 43.769 0 0 1 1.6113-0.15252 43.272 43.769 0 0 1 1.6158-0.091765 43.272 43.769 0 0 1 1.6176-0.030375 43.272 43.769 0 0 1 1.1142 0.014219 43.272 43.769 0 0 1 1.1136 0.043944 43.272 43.769 0 0 1 1.1117 0.072381 43.272 43.769 0 0 1 1.1098 0.10146 43.272 43.769 0 0 1 1.1066 0.12989 43.272 43.769 0 0 1 1.1034 0.15962 43.272 43.769 0 0 1 1.0983 0.18741 43.272 43.769 0 0 1 1.0938 0.2165 43.272 43.769 0 0 1 1.0874 0.24492 43.272 43.769 0 0 1 1.0816 0.27272 43.272 43.769 0 0 1 1.0733 0.30114 43.272 43.769 0 0 1 1.0657 0.32893 43.272 43.769 0 0 1 1.0574 0.35608 43.272 43.769 0 0 1 0.58203 0.21391l2.1154-5.8788a49.453 50.022 0 0 0-0.01789-0.0065 49.453 50.022 0 0 0-3.2418-1.065 49.453 50.022 0 0 0-0.051751-0.014869 49.453 50.022 0 0 0-3.2864-0.82913 49.453 50.022 0 0 0-0.070916-0.014869 49.453 50.022 0 0 0-3.3018-0.58937 49.453 50.022 0 0 0-0.11436-0.016807 49.453 50.022 0 0 0-3.3536-0.35608 49.453 50.022 0 0 0-0.045362-0.0032514 49.453 50.022 0 0 0-3.4302-0.12149z"/>
                        <path fill="#fff" d="m50-4.105e-6 -3.0908 6.2527h6.1817z"/>
                    </g>
                </svg>
    
                <div>
                    <p>{weather.getForecast("windspeed_10m").toFixed(0)}</p>
                    <p>{weather.getForecastUnit("windspeed_10m")}</p>
                </div>
            </div>
        </Widget>
    );
};

export default Wind;