import type { WidgetSize } from "Components/Widget";

import SkeletonWidget from "./style";


export default function Skeleton({
    id = undefined,
    className = "",
    size,
}: {
    id?: string;
    className?: string;
    size?: WidgetSize;
}) {
    return (
        <SkeletonWidget 
            id={id} 
            className={className} 
            size={size} 
            children={null} 
        />
    )
}
