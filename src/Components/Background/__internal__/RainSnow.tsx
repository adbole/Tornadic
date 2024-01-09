import React from "react";
import { useFrame } from "@react-three/fiber";
import type { BufferAttribute} from "three";
import {BufferGeometry, PointsMaterial, Vector3 } from "three";

import { randomBetween } from "ts/Helpers";
import type WeatherCondition from "ts/WeatherCondition";


export default function RainSnow({ condition }: { condition: WeatherCondition["type"] }) {
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        switch(condition) {
            case "Clear":
            case "Mostly Clear":
            case "Partly Cloudy":
            case "Overcast":
            case "Foggy":
                setShow(false)
                break
            default:
                setShow(true)
        }
    }, [condition])

    const rainGeo = React.useMemo(() => {
        const vertices = [];

        let amount;

        switch(condition) {
            case "Rain Showers":
            case "Snow Showers":
                amount = 500;
                break;
            case "Drizzle":
            case "Freezing Drizzle":
                amount = 250;
                break;
            default:
                amount = 1000;
                break;
        }

        for(let i = 0; i < amount; i++) {
            vertices.push(new Vector3(
                randomBetween(-200, 200),
                randomBetween(-250, 250),
                randomBetween(-100, -20)
            ))
        }

        return new BufferGeometry().setFromPoints(vertices)
    }, [condition])

    const material = React.useMemo(() => {
        let size;

        switch(condition) {
            case "Snow":
            case "Snow Grains":
            case "Snow Showers":
                size = 0.5
                break;
            default:
                size = 0.3
                break;
        }

        return new PointsMaterial({
            color: "#AAAAAA",
            size,
            transparent: true,
        })
    }, [condition])

    const speed = React.useMemo(() => {
        switch(condition) {
            case "Snow":
            case "Snow Grains":
            case "Snow Showers":
                return 10
            default:
                return 50
        }
    }, [condition])


    useFrame((_, delta) => {
        const positions = (rainGeo.attributes.position as BufferAttribute).array

        if(delta > 1) return;

        for(let i = 1; i < positions.length; i += 3) {
            positions[i] -= speed * delta

            if(positions[i] < -250) {
                positions[i] = 250
            }
        }

        (rainGeo.attributes.position as BufferAttribute).needsUpdate = true
    })

    return <points geometry={rainGeo} material={material} visible={show}/>
}