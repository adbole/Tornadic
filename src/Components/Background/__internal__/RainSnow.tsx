import React from "react";
import { useFrame } from "@react-three/fiber";
import type { BufferAttribute } from "three";
import { BufferGeometry, Vector3 } from "three";

import { randomBetween } from "ts/Helpers";
import type WeatherCondition from "ts/WeatherCondition";

import useViewport from "./useViewport";


export default function RainSnow({ condition }: { condition: WeatherCondition["type"] }) {
    const { width, height } = useViewport();

    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        switch (condition) {
            case "Clear":
            case "Mostly Clear":
            case "Partly Cloudy":
            case "Overcast":
            case "Foggy":
                setShow(false);
                break;
            default:
                setShow(true);
        }
    }, [condition]);

    const rainGeo = React.useMemo(() => {
        const vertices = [];

        let amount;

        switch (condition) {
            case "Drizzle":
            case "Freezing Drizzle":
                amount = 75;
                break;
            case "Rain Showers":
            case "Snow Showers":
                amount = 150;
                break;
            default:
                amount = 300;
                break;
        }

        //Bind amount to aspect ratio
        amount *= width / height;
        const halfWidth = width / 2;

        for (let i = 0; i < amount; i++) {
            vertices.push(
                new Vector3(
                    randomBetween(-halfWidth, halfWidth),
                    randomBetween(-height, height),
                    randomBetween(-75, -20)
                )
            );
        }

        return new BufferGeometry().setFromPoints(vertices);
    }, [condition, width, height]);

    const [size, speed] = React.useMemo(() => {
        switch (condition) {
            case "Snow":
            case "Snow Grains":
            case "Snow Showers":
                return [0.75, 10];
            default:
                return [0.3, 40];
        }
    }, [condition]);

    useFrame((_, delta) => {
        const positions = (rainGeo.attributes.position as BufferAttribute).array;

        if (delta > 1) return;

        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= speed * delta;

            if (positions[i] < -height) {
                positions[i] = height;
            }
        }

        (rainGeo.attributes.position as BufferAttribute).needsUpdate = true;
    });

    return (
        <>
            <points geometry={rainGeo} visible={show}>
                <pointsMaterial color={0xffffff} size={size} toneMapped={false} />
            </points>
        </>
    );
}
