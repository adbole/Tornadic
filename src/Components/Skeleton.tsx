import { Widget, WidgetSize } from "Components/SimpleComponents";

const SkeletonWidget = ({ id = undefined, size = WidgetSize.NORMAL }: { id?: string, size?: WidgetSize }) => 
    <Widget className="skeleton" id={id} size={size} children={null}/>;

const Skeleton = () => (
    <>
        <SkeletonWidget id="now" size={WidgetSize.LARGE}/>
        <SkeletonWidget id="hourly"/>
        <SkeletonWidget id="daily" size={WidgetSize.LARGE}/>
        <SkeletonWidget id="radar" size={WidgetSize.LARGE}/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget/>
        <SkeletonWidget size={WidgetSize.WIDE}/>
    </>
);

export default Skeleton;