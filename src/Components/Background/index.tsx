import React from "react";
import { css,Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useReadLocalStorage } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import { Clouds, Gradient, RainSnow, Stars, Thunder } from "./__internal__";


const StyledCanvas = styled(Canvas)({
    top: 0,
    left: 0,
    zIndex: -1,
});

const highContrast = css({ "#root": { color: "#3f3f3f" } })

export default function Background() {
    const { weather } = useWeather();
    const settings = useReadLocalStorage("userSettings")

    const condition = React.useMemo(() => weather.getNow().conditionInfo.type, [weather]);

    const [rayleigh, elevation, exposure] = React.useMemo(() => {
        if(weather.isDay()) {
            switch(condition) {
                case "Clear":
                case "Mostly Clear":
                    return [1, 0.75, 0.25]
                default: 
                    return [5, 0.75, 0.1]
            }
        }
        
        return [0, 0.75, 0.25]
        
    }, [weather, condition])

    if(!settings || settings.preferGradient) {
        return (
            <>
                <Gradient isDay={weather.isDay()} condition={condition}/>
                {
                    rayleigh === 1 && 
                    settings?.highContrastForLive && 
                    <Global styles={highContrast} />
                }
            </>
        )
    }

    return (
        <>
            {
                rayleigh === 1 && 
                settings.highContrastForLive && 
                <Global styles={highContrast} />
            }
            <StyledCanvas 
                style={{ position: "fixed" }} 
                gl={{ toneMappingExposure: exposure }} 
                fallback={<Gradient isDay={weather.isDay()} condition={condition}/>}
            >
                <Sky 
                    rayleigh={rayleigh}
                    inclination={elevation}
                    mieCoefficient={0.005}
                    mieDirectionalG={0.99}
                    turbidity={1}
                    azimuth={0.25}
                />
                <Clouds isDay={weather.isDay()} condition={condition} />
                <RainSnow condition={condition} />
                <Thunder condition={condition} />
                <Stars isDay={weather.isDay()} condition={condition} />
            </StyledCanvas>
        </>
    );
}