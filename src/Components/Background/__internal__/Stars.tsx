import React from "react";
import { BufferGeometry, Vector3 } from "three";

import { randomBetween } from "ts/Helpers";
import type WeatherCondition from "ts/WeatherCondition";

import useViewportBound from "./useViewport";


export default function Stars({
    isDay,
    condition,
}: {
    isDay: boolean;
    condition: WeatherCondition["type"];
}) {
    const { width, height } = useViewportBound();

    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (condition === "Clear" && !isDay) setShow(true);
        else setShow(false);
    }, [condition, isDay]);

    const starsGeo = React.useMemo(() => {
        const vertices = [];

        //Maximum stars based on aspect ratio
        const maxStars = (1000 * width) / height;

        for (let i = 0; i < maxStars; i++) {
            vertices.push(
                new Vector3(
                    randomBetween(-width / 2, width / 2),
                    randomBetween(-height / 2, height / 2),
                    randomBetween(-75, -20)
                )
            );
        }

        return new BufferGeometry().setFromPoints(vertices);
    }, [width, height]);

    return (
        <points geometry={starsGeo} visible={show}>
            <pointsMaterial color={0xffffff} size={0.2} transparent={true} />
        </points>
    );
}
