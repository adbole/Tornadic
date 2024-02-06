import React from "react";
import { SWRConfig, useSWRConfig } from "swr";


export default function FetchErrorHandler({
    children,
    errorRender,
}: {
    children: React.ReactNode;
    errorRender: (hasError: boolean, retry: () => void) => React.ReactNode;
}) {
    const { mutate } = useSWRConfig();
    const [errorKeys, setErrorKeys] = React.useState<Set<string>>(new Set);

    return (
        <>
            {errorRender(errorKeys.size > 0, () => {
                const keys = errorKeys;
                setErrorKeys(new Set);

                keys.forEach(key => mutate(key));
            })}
            <SWRConfig
                value={{
                    onError(_, key) {
                        setErrorKeys(prev => new Set([...prev, key]));
                    },
                }}
            >
                {children}
            </SWRConfig>
        </>
    );
}
