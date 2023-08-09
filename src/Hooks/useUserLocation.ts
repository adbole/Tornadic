/**
 * This hook provides a way to get the user's location.
 * This hook should be used in conjunction with an initial useLocalStorage
 * to set the default value and usePermission to avoid handling status'
 * outside OK with checks and fallback components everywhere in the application
 */

import React from "react";

import useReadLocalStorage from "./useReadLocalStorage";


type status = "no_storage" | "no_value" | "nav_not_supported" | "denied" | "loading" | "OK";

export default function useUserLocation() {
    const userLocation = useReadLocalStorage("userLocation");
    const [position, setPosition] = React.useState<UserLocation["coords"]>();
    const [status, setStatus] = React.useState<status>("loading");

    React.useEffect(() => {
        setStatus("loading")

        if (userLocation === null) {
            setStatus("no_storage");
        } else if (userLocation.useCurrent) {
            navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) =>
                {
                    setStatus("OK")
                    setPosition({
                        latitude,
                        longitude,
                    })
                }
            );
        }
        else {
            if(!userLocation.coords)
                setStatus("no_value")
            else
                setStatus("OK")
                setPosition(userLocation.coords)
        }
    }, [userLocation])


    return { ...position, status }
}
