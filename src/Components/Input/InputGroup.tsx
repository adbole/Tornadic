import { cleanClass } from "ts/Helpers";


export default function InputGroup({
    children,
    hasGap = false,
    isUniform = false,
}: {
    children: React.ReactNode;
    hasGap?: boolean;
    isUniform?: boolean;
}) {
    return (
        <div
            className={cleanClass(
                `input-group ${hasGap ? "gap" : ""} ${isUniform ? "uniform" : ""}`
            )}
        >
            {children}
        </div>
    );
}
