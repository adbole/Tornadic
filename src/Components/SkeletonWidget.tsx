import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import type { WidgetSize } from "Components/Widget";
import Widget from "Components/Widget";


const shine = keyframes({ "to": {  backgroundPositionX: "-200%" } })

const Skeleton = styled(Widget)({
    background: "linear-gradient(135deg, transparent 40%, #f5f5f51a 50%, transparent 60%)",
    backgroundSize: "200%, 100%",
    animation: `${shine} 1.5s linear infinite`,
})

export default function SkeletonWidget({
    id = undefined,
    className = "",
    size,
}: {
    id?: string;
    className?: string;
    size?: WidgetSize;
}) {
    return <Skeleton id={id} className={className} size={size} children={null} />;
}