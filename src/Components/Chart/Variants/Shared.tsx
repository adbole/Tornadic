export function getMinMaxFunc(view: ChartViews): (([min, max]: [number, number]) => [number, number]) | undefined {
    switch (view) {
        case "surface_pressure":
            return ([min, max]: [number, number]) => [min - 0.3, max + 0.3];
        case "precipitation":
            return ([_, max]: [number, number]) => [0, Math.max(0.5, max + 0.25)];
        case "relativehumidity_2m":
            return () => [0, 100];
        case "uv_index":
            return ([_, max]: [number, number]) => [0, Math.max(11, max)];
        default: return undefined; //Allow default behavior of chart
    }
}