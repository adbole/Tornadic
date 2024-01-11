import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PointLight } from "three";

import { randomBetween } from "ts/Helpers";
import type WeatherCondition from "ts/WeatherCondition";


export default function Thunderstorm({ condition }: { condition: WeatherCondition["type"]}) {
    const flash = React.useRef<PointLight>(null)
    const doFlash = React.useRef(false)

    const { width } = useThree(state => state.viewport)

    const [show, setShow] = React.useState(false)
    React.useEffect(() => {
        switch(condition) {
            case "Thunderstorms":
            case "Thunderstorms and Hail":
                setShow(true)
                break
            default:
                setShow(false)
        }
    }, [condition])
    
    useFrame(() => {
        if(!flash.current) return

        if(doFlash.current || flash.current.power > 100) {
            if(flash.current.power < 50) {
                flash.current.position.set(
                    randomBetween(-width, width),
                    randomBetween(5, 10),
                    -5
                )
            }

            flash.current.power = Math.random() * 500
        }
        else flash.current.power = 0;
    })

    // doFlash doesn't guarantee a flash, but it does prevent
    // it from happening too often
    React.useEffect(() => {
        doFlash.current = false
        const interval = setInterval(() => {
            doFlash.current = true

            setTimeout(() => {
                doFlash.current = false
            }, 500)
        }, 7500)

        return () => {
            doFlash.current = false
            clearInterval(interval)
        }
    }, [])

    return (
        <pointLight
            visible={show}
            ref={flash}
            color="#6b6cc2"
            intensity={30}
            distance={500}
            decay={1}
        />
    )
}