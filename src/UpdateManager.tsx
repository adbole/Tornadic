import { useRegisterSW } from "virtual:pwa-register/react";

import { Toast } from "Components";


export default function UpdateManager() {
    const { 
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW()

    return (
        <Toast 
            isOpen={needRefresh} 
            actions={[
                {
                    content: "Refresh",
                    onClick: () => updateServiceWorker(true)
                },
                {
                    content: "Dismiss",
                    onClick: () => setNeedRefresh(false)
                }
            ]}
        >
            <p>A new version is available!</p>
        </Toast>
    )
}