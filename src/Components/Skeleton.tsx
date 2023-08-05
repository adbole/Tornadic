import Widget, { WidgetSize } from "Components/Widget";


function SkeletonWidget({ id = undefined, size }: { id?: string; size?: WidgetSize }) {
    return <Widget className="skeleton" id={id} size={size} children={null} />;
}

export default function Skeleton() {
    return (
        <>
            <SkeletonWidget id="now" size={"widget-large"} />
            <SkeletonWidget id="hourly" />
            <SkeletonWidget id="daily" size={"widget-large"} />
            <SkeletonWidget id="radar" size={"widget-large"} />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget size={"widget-wide"} />
        </>
    );
}
