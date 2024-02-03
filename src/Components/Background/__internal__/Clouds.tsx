import React from "react";
import { Cloud } from "@react-three/drei";

import type WeatherCondition from "ts/WeatherCondition";


export default function Clouds({
    isDay,
    condition,
}: {
    isDay: boolean;
    condition: WeatherCondition["type"];
}) {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        switch (condition) {
            case "Clear":
                setShow(false);
                break;
            default:
                setShow(true);
        }
    }, [condition]);

    const [segments, opacity] = React.useMemo(() => {
        switch (condition) {
            case "Overcast":
            case "Rain":
            case "Freezing Rain":
            case "Snow":
            case "Snow Grains":
            case "Thunderstorms":
            case "Thunderstorms and Hail":
                return [200, 1];
            case "Rain Showers":
            case "Snow Showers":
            case "Partly Cloudy":
                return [100, 0.4];
            default:
                return [50, 0.25];
        }
    }, [condition]);

    return (
        <group visible={show}>
            <ambientLight intensity={isDay ? 5 : 0.2} />
            <Cloud
                seed={1}
                position={[0, 10, -10]}
                segments={segments}
                opacity={opacity}
                growth={5}
                speed={0.2}
                bounds={[30, 1, 1]}
            />
        </group>
    );
}
