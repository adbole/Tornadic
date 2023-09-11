import React from "react";
import { SWRConfig, useSWRConfig } from "swr";


export default function FetchErrorHandler({
    children,
    errorRender,
}: {
    children: React.ReactNode;
    errorRender: (hasError: boolean, retry: () => void) => JSX.Element;
}) {
    const { mutate } = useSWRConfig();
    const [errorKeys, setErrorKeys] = React.useState<string[]>([]);

    return (
        <>
            {errorRender(errorKeys.length > 0, () => {
                const keys = errorKeys;
                setErrorKeys([]);

                keys.forEach(key => mutate(key));
            })}
            <SWRConfig
                value={{
                    onError(_, key) {
                        setErrorKeys(prev => [...prev, key]);
                    },
                }}
            >
                {children}
            </SWRConfig>
        </>
    );
}
