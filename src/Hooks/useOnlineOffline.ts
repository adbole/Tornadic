import React from "react";

import useBooleanState from "./useBooleanState";


export default function useOnlineOffline() {
    const [online, setOnlineTrue, setOnlineFalse] = useBooleanState(navigator.onLine);

    React.useEffect(() => {
        window.addEventListener("online", setOnlineTrue);
        window.addEventListener("offline", setOnlineFalse);

        return () => {
            window.removeEventListener("online", setOnlineTrue);
            window.removeEventListener("offline", setOnlineFalse);
        };
    }, [setOnlineFalse, setOnlineTrue]);

    return online;
}
