// eslint-disable-next-line import/no-anonymous-default-export
export default {
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "s": "https://schema.org/",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#",
            "geometry": {
                "@id": "s:GeoCoordinates",
                "@type": "geo:wktLiteral"
            },
            "city": "s:addressLocality",
            "state": "s:addressRegion",
            "distance": {
                "@id": "s:Distance",
                "@type": "s:QuantitativeValue"
            },
            "bearing": { "@type": "s:QuantitativeValue" },
            "value": { "@id": "s:value" },
            "unitCode": {
                "@id": "s:unitCode",
                "@type": "@id"
            },
            "forecastOffice": { "@type": "@id" },
            "forecastGridData": { "@type": "@id" },
            "publicZone": { "@type": "@id" },
            "county": { "@type": "@id" }
        }
    ],
    "id": "https://api.weather.gov/points/35.5125,-97.5099",
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -97.5099,
            35.5125
        ]
    },
    "properties": {
        "@id": "https://api.weather.gov/points/35.5125,-97.5099",
        "@type": "wx:Point",
        "cwa": "OUN",
        "forecastOffice": "https://api.weather.gov/offices/OUN",
        "gridId": "OUN",
        "gridX": 98,
        "gridY": 96,
        "forecast": "https://api.weather.gov/gridpoints/OUN/98,96/forecast",
        "forecastHourly": "https://api.weather.gov/gridpoints/OUN/98,96/forecast/hourly",
        "forecastGridData": "https://api.weather.gov/gridpoints/OUN/98,96",
        "observationStations": "https://api.weather.gov/gridpoints/OUN/98,96/stations",
        "relativeLocation": {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -97.54327,
                    35.546389
                ]
            },
            "properties": {
                "city": "Nichols Hills",
                "state": "OK",
                "distance": {
                    "unitCode": "wmoUnit:m",
                    "value": 4828.9540806785
                },
                "bearing": {
                    "unitCode": "wmoUnit:degree_(angle)",
                    "value": 141
                }
            }
        },
        "forecastZone": "https://api.weather.gov/zones/forecast/OKZ025",
        "county": "https://api.weather.gov/zones/county/OKC109",
        "fireWeatherZone": "https://api.weather.gov/zones/fire/OKZ025",
        "timeZone": "America/Chicago",
        "radarStation": "KTLX"
    }
}