import React from "react";
import { Cloud } from "@react-three/drei";

import type WeatherCondition from "ts/WeatherCondition";


export default function Clouds({ isDay, condition }: { isDay: boolean, condition: WeatherCondition["type"] }) {
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        switch(condition) {
            case "Clear":
                setShow(false)
                break
            default:
                setShow(true)
        }
    }, [condition])

    const cloudsType = React.useMemo(() => {
        switch(condition) {
            case "Overcast":
            case "Rain":
            case "Snow":
            case "Snow Grains":
            case "Thunderstorms":
            case "Thunderstorms and Hail":
                return "Heavy"
            case "Rain Showers":
            case "Snow Showers":
            case "Partly Cloudy":
                return "Medium"
            default:
                return "Light"
        }
    }, [condition])

    const segments = React.useMemo(() => {
        if(cloudsType === "Heavy") return 200;
        else if(cloudsType === "Medium") return 100;

        return 50;
    }, [cloudsType]);


    const opacity = React.useMemo(() => {
        if(cloudsType === "Heavy") return 1;
        else if(cloudsType === "Medium") return 0.4;

        return 0.25;
    }, [cloudsType]);

    return (
        <group visible={show}>
            <ambientLight intensity={isDay ? 4 : 0.2} />
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
    )
}