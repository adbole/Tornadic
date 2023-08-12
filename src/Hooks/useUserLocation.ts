/**
 * This hook provides a way to get the user's location.
 * This hook should be used in conjunction with an initial useLocalStorage
 * to set the default value and usePermission to avoid handling status'
 * outside OK with checks and fallback components everywhere in the application
 */

import React from "react";

import useReadLocalStorage from "./useReadLocalStorage";


type Status =
    | "no_storage"
    | "no_value"
    | "nav_not_supported"
    | "denied"
    | "loading"
    | "OK"
    | "getting_current";

export default function useUserLocation() {
    const userLocation = useReadLocalStorage("userLocation");
    const [position, setPosition] = React.useState<UserLocation["coords"]>();
    const [status, setStatus] = React.useState<Status>("loading");

    React.useEffect(() => {
        setStatus("loading");

        if (userLocation === null) {
            setStatus("no_storage");
        } else if (userLocation.useCurrent) {
            if (!navigator.geolocation) {
                setStatus("nav_not_supported");
                return;
            }

            setStatus("getting_current");
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    setStatus("OK");
                    setPosition({
                        latitude,
                        longitude,
                    });
                },
                () => setStatus("denied")
            );
        } else {
            if (!userLocation.coords) setStatus("no_value");
            else setStatus("OK");
            setPosition(userLocation.coords);
        }
    }, [userLocation]);

    return { ...position, status };
}
