//The following are the tests ids grouped by component
//To help prevent double use, please use the following format:
// {ComponentName}: {ComponentName}_{ComponentPart}

const testIds = {
    HazardLevel: { SVG_GROUP: "HAZARD_LEVEL_GROUP_ROTATION" },
    Widget: { WidgetSection: "WIDGET_SECTION" },
    Wind: { WindIndicator: "WIND_INDICATOR" },
    SearchInput: { Skeleton: "SEARCH_INPUT_SKELETON" },
    Chart: {
        Axes_X: "CHART_AXES_X",
        Axes_Y: "CHART_AXES_Y",
        Axes_X_Grid: "CHART_AXES_X_GRID",
        Axes_Y_Grid: "CHART_AXES_Y_GRID",
    },
    WeatherContext: { LoadingBar: "WEATHER_CONTEXT_LOADING_BAR" },
} as const;

export default testIds;
