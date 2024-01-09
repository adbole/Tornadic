import React from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, PointsMaterial,Vector3 } from "three";

import { randomBetween } from "ts/Helpers";
import type WeatherCondition from "ts/WeatherCondition";


export default function Stars({ isDay, condition }: { isDay: boolean, condition: WeatherCondition["type"]}) {
    const { width, height } = useThree(state => state.viewport)
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        if(condition === "Clear" && !isDay) setShow(true)
        else setShow(false)
    }, [condition, isDay])

    const starsGeo = React.useMemo(() => {
        const vertices = [];

        for(let i = 0; i < 750; i++) {
            vertices.push(new Vector3(
                randomBetween(-width * 5, width * 5),
                randomBetween(-height * 5, height * 5),
                randomBetween(-75, -20)
            ))
        }

        return new BufferGeometry().setFromPoints(vertices)
    }, [width, height])

    const material = React.useMemo(() => new PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
    }), [])

    return <points geometry={starsGeo} material={material} visible={show} />
}