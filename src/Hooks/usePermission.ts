import React from "react";


type State = PermissionState | "unknown";

export default function usePermission(permissionName: PermissionName) {
    const [state, setState] = React.useState<State>("unknown");

    React.useEffect(() => {
        navigator.permissions.query({ name: permissionName }).then(result => {
            setState(result.state);

            result.onchange = () => {
                setState(result.state);
            };
        });
    }, [permissionName]);

    return state;
}
