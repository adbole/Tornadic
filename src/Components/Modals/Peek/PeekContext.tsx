import React from "react";

import { useOpenMeteo } from "Hooks";

import { throwError } from "ts/Helpers";
import type NWSAlert from "ts/NWSAlert";
import type Weather from "ts/Weather";


const Context = React.createContext<{
    weather: Weather;
    alerts: NWSAlert[];
}>({} as any);

export const usePeekWeather = () =>
    React.useContext(Context) || throwError("Please use usePeekWeather within a PeekContext");

export default function PeekContext({
    latitude,
    longitude,
    children,
}: {
    latitude?: number;
    longitude?: number;
    children: React.ReactNode;
}) {
    const { weather, alerts } = useOpenMeteo(latitude, longitude);

    const value = React.useMemo(() => {
        if (!weather || !alerts) return null;

        return {
            weather,
            alerts,
        };
    }, [weather, alerts]);

    if (!value) return (
        <div>
            <span className="text-loader"/>
            <span className="text-loader"/>
            <span className="text-loader"/>
            <span className="text-loader"/>
        </div>
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
