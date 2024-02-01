import React from "react";
import { Global } from "@emotion/react";
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

function HighConstrast({ rayleigh }: { rayleigh: number }) {
    const settings = useReadLocalStorage("userSettings");

    if (rayleigh !== 1 || !settings?.highContrastForLive) return null;

    return <Global styles={{ "#root": { color: "#3f3f3f" } }} />;
}

export default function Background() {
    const { weather } = useWeather();
    const settings = useReadLocalStorage("userSettings");

    const { isDay, condition } = React.useMemo(
        () => ({
            isDay: weather.isDay(),
            condition: weather.getNow().conditionInfo.type,
        }),
        [weather]
    );

    const [rayleigh, elevation, exposure] = React.useMemo(() => {
        if (isDay) {
            switch (condition) {
                case "Clear":
                case "Mostly Clear":
                    return [1, 0.75, 0.25];
                default:
                    return [5, 0.75, 0.1];
            }
        }

        return [0.01, 0.75, 0.2];
    }, [isDay, condition]);

    return (
        <>
            <HighConstrast rayleigh={rayleigh} />
            <Gradient isDay={isDay} condition={condition} />
            
            {settings && !settings.preferGradient && (
                <StyledCanvas
                    style={{ position: "fixed" }}
                    gl={{ toneMappingExposure: exposure }}
                >
                    <Sky
                        rayleigh={rayleigh}
                        inclination={elevation}
                        mieCoefficient={0.005}
                        mieDirectionalG={0.99}
                        turbidity={1}
                        azimuth={0.25}
                    />
                    <Clouds isDay={isDay} condition={condition} />
                    <RainSnow condition={condition} />
                    <Thunder condition={condition} />
                    <Stars isDay={isDay} condition={condition} />
                </StyledCanvas>
            )}
        </>
    );
}
