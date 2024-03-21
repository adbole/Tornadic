// eslint-disable-next-line import/no-anonymous-default-export
export default {
    id: "https://api.weather.gov/points/35.5125,-97.5099",
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [-107, 33.2], //Modified for point in polygon alert test
    },
    properties: {
        "@id": "https://api.weather.gov/points/35.5125,-97.5099",
        "@type": "wx:Point",
        cwa: "OUN",
        forecastOffice: "https://api.weather.gov/offices/OUN",
        gridId: "OUN",
        gridX: 98,
        gridY: 96,
        forecast: "https://api.weather.gov/gridpoints/OUN/98,96/forecast",
        forecastHourly: "https://api.weather.gov/gridpoints/OUN/98,96/forecast/hourly",
        forecastGridData: "https://api.weather.gov/gridpoints/OUN/98,96",
        observationStations: "https://api.weather.gov/gridpoints/OUN/98,96/stations",
        relativeLocation: {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [-97.5, 35.5],
            },
            properties: {
                city: "Oklahoma City",
                state: "OK",
                distance: {
                    unitCode: "wmoUnit:m",
                    value: 3863.867032188,
                },
                bearing: {
                    unitCode: "wmoUnit:degree_(angle)",
                    value: 18,
                },
            },
        },
        forecastZone: "https://api.weather.gov/zones/forecast/OKZ025",
        county: "https://api.weather.gov/zones/county/OKC109",
        fireWeatherZone: "https://api.weather.gov/zones/fire/OKZ025",
        timeZone: "America/Chicago",
        radarStation: "KTLX",
    },
};