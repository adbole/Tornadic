import Widget, { WidgetSize } from "Components/Widget";


const SkeletonWidget = ({ id = undefined, size }: { id?: string, size?: WidgetSize }) => 
    <Widget className="skeleton" id={id} size={size} children={null}/>;

const Skeleton = () => (
    <>
        <SkeletonWidget id="now" size={"widget-large"}/>
        <SkeletonWidget id="hourly"/>
        <SkeletonWidget id="daily" size={"widget-large"}/>
        <SkeletonWidget id="radar" size={"widget-large"}/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget size={"widget-wide"}/>
    </>
);

export default Skeleton;