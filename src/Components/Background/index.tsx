import React from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { PerspectiveCamera, ScreenSpace, Sky } from "@react-three/drei";
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

    const [rayleigh, rotation, exposure] = React.useMemo(() => {
        if (isDay) {
            switch (condition) {
                case "Clear":
                case "Mostly Clear":
                    return [1, 0.35, 0.25];
                default:
                    return [5, 0, 0.1];
            }
        }

        return [0.01, 0.35, 0.2];
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
                    <PerspectiveCamera makeDefault rotation={[rotation, 0, 0]} />
                    <Sky
                        rayleigh={rayleigh}
                        inclination={1}
                        mieCoefficient={0.005}
                        mieDirectionalG={0.99}
                        turbidity={1}
                        azimuth={0.25}
                    />
                    <ScreenSpace depth={15}>
                        <Clouds isDay={isDay} condition={condition} />
                        <RainSnow condition={condition} />
                        <Thunder condition={condition} />
                        <Stars isDay={isDay} condition={condition} />
                    </ScreenSpace>
                </StyledCanvas>
            )}
        </>
    );
}
