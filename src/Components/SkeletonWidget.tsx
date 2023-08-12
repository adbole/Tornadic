import type { WidgetSize } from "Components/Widget";
import Widget from "Components/Widget";


export default function SkeletonWidget({
    id = undefined,
    className = "",
    size,
}: {
    id?: string;
    className?: string;
    size?: WidgetSize;
}) {
    return <Widget id={id} className={`${className} skeleton`} size={size} children={null} />;
}
