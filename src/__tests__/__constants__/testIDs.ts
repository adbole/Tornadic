//The following are the tests ids grouped by component
//To help prevent double use, please use the following format:
// {ComponentName}: {ComponentName}_{ComponentPart}

const testIds = { 
    HazardLevel: { SVG_GROUP: "HAZARD_LEVEL_GROUP_ROTATION", },
    Widget: { WidgetSection: "WIDGET_SECTION", },
    Wind: { WindIndicator: "WIND_INDICATOR", },
    SearchInput: { Skeleton: "SEARCH_INPUT_SKELETON", },
} as const

export default testIds