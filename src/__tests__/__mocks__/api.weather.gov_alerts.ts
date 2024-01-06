export const single = {
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "@vocab": "https://api.weather.gov/ontology#"
        }
    ],
    "type": "FeatureCollection",
    "features": [
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.7b7a54584f6725c7883c2f41d52be172ea827776.001.1",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -107.22,
                            33.22
                        ],
                        [
                            -107.16,
                            33.31
                        ],
                        [
                            -106.8199999,
                            33.25
                        ],
                        [
                            -106.95,
                            33.03
                        ],
                        [
                            -107.22,
                            33.22
                        ]
                    ]
                ]
            },
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.7b7a54584f6725c7883c2f41d52be172ea827776.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.7b7a54584f6725c7883c2f41d52be172ea827776.001.1",
                "areaDesc": "Sierra, NM",
                "geocode": {
                    "SAME": [
                        "035051"
                    ],
                    "UGC": [
                        "NMC051"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/county/NMC051",
                    "https://api.weather.gov/zones/forecast/OKZ025"
                ],
                "references": [],
                "sent": "2023-09-12T20:12:00-06:00",
                "effective": "2023-09-12T20:12:00-06:00",
                "onset": "2023-09-12T20:12:00-06:00",
                "expires": "2023-09-12T20:45:00-06:00",
                "ends": "2023-09-12T20:45:00-06:00",
                "status": "Actual",
                "messageType": "Alert",
                "category": "Met",
                "severity": "Severe",
                "certainty": "Observed",
                "urgency": "Immediate",
                "event": "Severe Thunderstorm Warning",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS El Paso Tx/Santa Teresa NM",
                "headline": "Severe Thunderstorm Warning issued September 12 at 8:12PM MDT until September 12 at 8:45PM MDT by NWS El Paso Tx/Santa Teresa NM",
                "description": "The National Weather Service in El Paso has issued a\n\n* Severe Thunderstorm Warning for...\nNorth central Sierra County in south central New Mexico...\n\n* Until 845 PM MDT.\n\n* At 811 PM MDT, a severe thunderstorm was located 6 miles northwest\nof Engle, moving southeast at 35 mph.\n\nHAZARD...60 mph wind gusts and quarter size hail.\n\nSOURCE...Radar indicated.\n\nIMPACT...Hail damage to vehicles is expected. Expect wind damage\nto roofs, siding, and trees.\n\n* Locations impacted include...\nEngle, Elephant Butte Lake, Lost Canyon, and Rock Canyon.",
                "instruction": "For your protection move to an interior room on the lowest floor of a\nbuilding.",
                "response": "Shelter",
                "parameters": {
                    "AWIPSidentifier": [
                        "SVREPZ"
                    ],
                    "WMOidentifier": [
                        "WUUS54 KEPZ 130212"
                    ],
                    "eventMotionDescription": [
                        "2023-09-13T02:11:00-00:00...storm...292DEG...28KT...33.23,-107.12"
                    ],
                    "windThreat": [
                        "RADAR INDICATED"
                    ],
                    "maxWindGust": [
                        "60 MPH"
                    ],
                    "hailThreat": [
                        "RADAR INDICATED"
                    ],
                    "maxHailSize": [
                        "1.00"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "EAS-ORG": [
                        "WXR"
                    ],
                    "VTEC": [
                        "/O.NEW.KEPZ.SV.W.0044.230913T0212Z-230913T0245Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T02:45:00+00:00"
                    ]
                }
            }
        }
    ],
    "title": "Current watches, warnings, and advisories for Sierra County (NMC051) NM",
    "updated": "2023-09-13T02:15:56+00:00"
}

export const all = {
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "@vocab": "https://api.weather.gov/ontology#"
        }
    ],
    "type": "FeatureCollection",
    "features": [
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0-KEEPALIVE-57038",
            "type": "Feature",
            "geometry": null,
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0-KEEPALIVE-57038",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0-KEEPALIVE-57038",
                "areaDesc": "Montgomery",
                "geocode": {
                    "SAME": [
                        "024031"
                    ],
                    "UGC": [
                        "MDC031"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/county/MDC031",
                    "https://api.weather.gov/zones/forecast/OKZ025"
                ],
                "references": [],
                "sent": "2023-09-13T02:15:36+00:00",
                "effective": "2023-09-13T02:15:36+00:00",
                "onset": null,
                "expires": "2023-09-13T02:25:36+00:00",
                "ends": null,
                "status": "Test",
                "messageType": "Alert",
                "category": "Met",
                "severity": "Unknown",
                "certainty": "Unknown",
                "urgency": "Unknown",
                "event": "Test Message",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS",
                "headline": null,
                "description": "Monitoring message only. Please disregard.",
                "instruction": "Monitoring message only. Please disregard.",
                "response": "None",
                "parameters": {
                    "AWIPSidentifier": [
                        "KEPWBC"
                    ],
                    "WMOidentifier": [
                        "NZUS91 KWBC 130215"
                    ],
                    "BLOCKCHANNEL": [
                        "CMAS",
                        "EAS",
                        "NWEM"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.b4afc910d79a50ce32053479f01196406ba5242c.001.1",
            "type": "Feature",
            "geometry": null,
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.b4afc910d79a50ce32053479f01196406ba5242c.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.b4afc910d79a50ce32053479f01196406ba5242c.001.1",
                "areaDesc": "Coastal Bryan; Coastal Chatham; Coastal Liberty; Coastal McIntosh; Beaufort; Coastal Colleton; Charleston; Coastal Jasper",
                "geocode": {
                    "SAME": [
                        "013029",
                        "013051",
                        "013179",
                        "013191",
                        "045013",
                        "045029",
                        "045019",
                        "045053"
                    ],
                    "UGC": [
                        "GAZ117",
                        "GAZ119",
                        "GAZ139",
                        "GAZ141",
                        "SCZ048",
                        "SCZ049",
                        "SCZ050",
                        "SCZ051"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/forecast/GAZ117",
                    "https://api.weather.gov/zones/forecast/GAZ119",
                    "https://api.weather.gov/zones/forecast/GAZ139",
                    "https://api.weather.gov/zones/forecast/GAZ141",
                    "https://api.weather.gov/zones/forecast/SCZ048",
                    "https://api.weather.gov/zones/forecast/SCZ049",
                    "https://api.weather.gov/zones/forecast/SCZ050",
                    "https://api.weather.gov/zones/forecast/SCZ051",
                    "https://api.weather.gov/zones/forecast/OKZ025"
                ],
                "references": [
                    {
                        "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.2973f1efbc4d6b6adfc78713eec120820e13205b.001.1",
                        "identifier": "urn:oid:2.49.0.1.840.0.2973f1efbc4d6b6adfc78713eec120820e13205b.001.1",
                        "sender": "w-nws.webmaster@noaa.gov",
                        "sent": "2023-09-12T15:36:00-04:00"
                    }
                ],
                "sent": "2023-09-12T22:16:00-04:00",
                "effective": "2023-09-12T22:16:00-04:00",
                "onset": "2023-09-12T22:15:00-04:00",
                "expires": "2023-09-13T06:15:00-04:00",
                "ends": "2023-09-13T20:00:00-04:00",
                "status": "Actual",
                "messageType": "Update",
                "category": "Met",
                "severity": "Moderate",
                "certainty": "Likely",
                "urgency": "Expected",
                "event": "Rip Current Statement",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS Charleston SC",
                "headline": "Rip Current Statement issued September 12 at 10:15PM EDT until September 13 at 8:00PM EDT by NWS Charleston SC",
                "description": "* WHAT...Dangerous rip currents.\n\n* WHERE...South Carolina Beaches, and Georgia Beaches.\n\n* WHEN...Through Wednesday evening.\n\n* IMPACTS...Rip currents can sweep even the best swimmers away\nfrom shore into deeper water.",
                "instruction": "Swim near a lifeguard. If caught in a rip current, relax and\nfloat. Don't swim against the current. If able, swim in a\ndirection following the shoreline. If unable to escape, face the\nshore and call or wave for help.",
                "response": "Avoid",
                "parameters": {
                    "AWIPSidentifier": [
                        "CFWCHS"
                    ],
                    "WMOidentifier": [
                        "WHUS42 KCHS 130215"
                    ],
                    "NWSheadline": [
                        "HIGH RIP CURRENT RISK REMAINS IN EFFECT THROUGH WEDNESDAY EVENING"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "VTEC": [
                        "/O.CON.KCHS.RP.S.0009.000000T0000Z-230914T0000Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-14T00:00:00+00:00"
                    ],
                    "expiredReferences": [
                        "w-nws.webmaster@noaa.gov,urn:oid:2.49.0.1.840.0.7d0d1241d3a5034244c9fbda489744726ab3e2db.001.1,2023-09-12T11:06:00-04:00 w-nws.webmaster@noaa.gov,urn:oid:2.49.0.1.840.0.f4ca99ee0b7b7da94ab93d30b9e0cdf1af0c9b49.001.1,2023-09-12T05:47:00-04:00 w-nws.webmaster@noaa.gov,urn:oid:2.49.0.1.840.0.2722ab9163a53a7730b849a930cf2a7708718fc8.001.1,2023-09-12T02:57:00-04:00 w-nws.webmaster@noaa.gov,urn:oid:2.49.0.1.840.0.3c8c5939ed8ec76f669dc14d7006b9a590bb1a53.001.1,2023-09-12T00:20:00-04:00 w-nws.webmaster@noaa.gov,urn:oid:2.49.0.1.840.0.9ad48c981fdc52f9792493f291c1ec89514ec935.001.1,2023-09-11T19:59:00-04:00 w-nws.webmaster@noaa.gov,urn:oid:2.49.0.1.840.0.960e17785eb7f2fdb215d2abe05846c077825a31.001.1,2023-09-11T15:43:00-04:00"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.7b7a54584f6725c7883c2f41d52be172ea827776.001.1",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -107.22,
                            33.22
                        ],
                        [
                            -107.16,
                            33.31
                        ],
                        [
                            -106.8199999,
                            33.25
                        ],
                        [
                            -106.95,
                            33.03
                        ],
                        [
                            -107.22,
                            33.22
                        ]
                    ]
                ]
            },
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.7b7a54584f6725c7883c2f41d52be172ea827776.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.7b7a54584f6725c7883c2f41d52be172ea827776.001.1",
                "areaDesc": "Sierra, NM",
                "geocode": {
                    "SAME": [
                        "035051"
                    ],
                    "UGC": [
                        "NMC051"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/county/NMC051",
                    "https://api.weather.gov/zones/forecast/OKZ025"
                ],
                "references": [],
                "sent": "2023-09-12T20:12:00-06:00",
                "effective": "2023-09-12T20:12:00-06:00",
                "onset": "2023-09-12T20:12:00-06:00",
                "expires": "2023-09-12T20:45:00-06:00",
                "ends": "2023-09-12T20:45:00-06:00",
                "status": "Actual",
                "messageType": "Alert",
                "category": "Met",
                "severity": "Severe",
                "certainty": "Observed",
                "urgency": "Immediate",
                "event": "Severe Thunderstorm Warning",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS El Paso Tx/Santa Teresa NM",
                "headline": "Severe Thunderstorm Warning issued September 12 at 8:12PM MDT until September 12 at 8:45PM MDT by NWS El Paso Tx/Santa Teresa NM",
                "description": "The National Weather Service in El Paso has issued a\n\n* Severe Thunderstorm Warning for...\nNorth central Sierra County in south central New Mexico...\n\n* Until 845 PM MDT.\n\n* At 811 PM MDT, a severe thunderstorm was located 6 miles northwest\nof Engle, moving southeast at 35 mph.\n\nHAZARD...60 mph wind gusts and quarter size hail.\n\nSOURCE...Radar indicated.\n\nIMPACT...Hail damage to vehicles is expected. Expect wind damage\nto roofs, siding, and trees.\n\n* Locations impacted include...\nEngle, Elephant Butte Lake, Lost Canyon, and Rock Canyon.",
                "instruction": "For your protection move to an interior room on the lowest floor of a\nbuilding.",
                "response": "Shelter",
                "parameters": {
                    "AWIPSidentifier": [
                        "SVREPZ"
                    ],
                    "WMOidentifier": [
                        "WUUS54 KEPZ 130212"
                    ],
                    "eventMotionDescription": [
                        "2023-09-13T02:11:00-00:00...storm...292DEG...28KT...33.23,-107.12"
                    ],
                    "windThreat": [
                        "RADAR INDICATED"
                    ],
                    "maxWindGust": [
                        "60 MPH"
                    ],
                    "hailThreat": [
                        "RADAR INDICATED"
                    ],
                    "maxHailSize": [
                        "1.00"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "EAS-ORG": [
                        "WXR"
                    ],
                    "VTEC": [
                        "/O.NEW.KEPZ.SV.W.0044.230913T0212Z-230913T0245Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T02:45:00+00:00"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.c581ce027fdb1ed896b8fd4acad48598c1787d54.001.1",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -115.69,
                            36.97
                        ],
                        [
                            -115.46,
                            36.96
                        ],
                        [
                            -115.39,
                            37.06
                        ],
                        [
                            -115.38,
                            37.18
                        ],
                        [
                            -115.75999999999999,
                            37.2299999
                        ],
                        [
                            -115.80999999999999,
                            37.1599999
                        ],
                        [
                            -115.82,
                            37.080000000000005
                        ],
                        [
                            -115.69,
                            36.97
                        ]
                    ]
                ]
            },
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.c581ce027fdb1ed896b8fd4acad48598c1787d54.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.c581ce027fdb1ed896b8fd4acad48598c1787d54.001.1",
                "areaDesc": "Lincoln, NV",
                "geocode": {
                    "SAME": [
                        "032017"
                    ],
                    "UGC": [
                        "NVC017"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/county/NVC017"
                ],
                "references": [
                    {
                        "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.92ae1a3be09da3da2f54f4091b429653f2fac733.001.1",
                        "identifier": "urn:oid:2.49.0.1.840.0.92ae1a3be09da3da2f54f4091b429653f2fac733.001.1",
                        "sender": "w-nws.webmaster@noaa.gov",
                        "sent": "2023-09-12T18:06:00-07:00"
                    },
                    {
                        "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.29220c254fc98f9c5f1f094bce6f8255420f3c30.001.1",
                        "identifier": "urn:oid:2.49.0.1.840.0.29220c254fc98f9c5f1f094bce6f8255420f3c30.001.1",
                        "sender": "w-nws.webmaster@noaa.gov",
                        "sent": "2023-09-12T17:14:00-07:00"
                    }
                ],
                "sent": "2023-09-12T19:06:00-07:00",
                "effective": "2023-09-12T19:06:00-07:00",
                "onset": "2023-09-12T19:06:00-07:00",
                "expires": "2023-09-12T20:15:00-07:00",
                "ends": "2023-09-12T20:15:00-07:00",
                "status": "Actual",
                "messageType": "Update",
                "category": "Met",
                "severity": "Severe",
                "certainty": "Likely",
                "urgency": "Immediate",
                "event": "Flash Flood Warning",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS Las Vegas NV",
                "headline": "Flash Flood Warning issued September 12 at 7:06PM PDT until September 12 at 8:15PM PDT by NWS Las Vegas NV",
                "description": "At 706 PM PDT, Doppler radar indicated that thunderstorms had ended\nover far southwest Lincoln County. Very heavy rain fell in the\nmountains earlier, and this water is likely still flowing downhill.\n\nHAZARD...Life-threatening flash flooding. Thunderstorms producing\nflash flooding.\n\nSOURCE...Radar.\n\nIMPACT...Life-threatening flash flooding of low-water crossings,\ncreeks, normally dry washes and roads.\n\nSome locations that will experience flash flooding include...\nmainly rural areas of Southwestern Lincoln County",
                "instruction": "Turn around, don't drown when encountering flooded roads. Most flood\ndeaths occur in vehicles.",
                "response": "Avoid",
                "parameters": {
                    "AWIPSidentifier": [
                        "FFSVEF"
                    ],
                    "WMOidentifier": [
                        "WGUS75 KVEF 130206"
                    ],
                    "NWSheadline": [
                        "FLASH FLOOD WARNING REMAINS IN EFFECT UNTIL 815 PM PDT THIS EVENING FOR SOUTHWESTERN LINCOLN COUNTY"
                    ],
                    "flashFloodDetection": [
                        "RADAR INDICATED"
                    ],
                    "flashFloodDamageThreat": [
                        "CONSIDERABLE"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "EAS-ORG": [
                        "WXR"
                    ],
                    "VTEC": [
                        "/O.CON.KVEF.FF.W.0140.000000T0000Z-230913T0315Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T03:15:00+00:00"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.8a229c89553b04dfed036b8872e739fb20f1194d.001.1",
            "type": "Feature",
            "geometry": null,
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.8a229c89553b04dfed036b8872e739fb20f1194d.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.8a229c89553b04dfed036b8872e739fb20f1194d.001.1",
                "areaDesc": "Vilas; Oneida; Forest; Lincoln",
                "geocode": {
                    "SAME": [
                        "055125",
                        "055085",
                        "055041",
                        "055069"
                    ],
                    "UGC": [
                        "WIZ005",
                        "WIZ010",
                        "WIZ011",
                        "WIZ018"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/forecast/WIZ005",
                    "https://api.weather.gov/zones/forecast/WIZ010",
                    "https://api.weather.gov/zones/forecast/WIZ011",
                    "https://api.weather.gov/zones/forecast/WIZ018"
                ],
                "references": [
                    {
                        "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.6c466d4db82d0ece566921dc861ec32a67b73e6e.001.1",
                        "identifier": "urn:oid:2.49.0.1.840.0.6c466d4db82d0ece566921dc861ec32a67b73e6e.001.1",
                        "sender": "w-nws.webmaster@noaa.gov",
                        "sent": "2023-09-12T14:05:00-05:00"
                    }
                ],
                "sent": "2023-09-12T21:04:00-05:00",
                "effective": "2023-09-12T21:04:00-05:00",
                "onset": "2023-09-13T02:00:00-05:00",
                "expires": "2023-09-13T08:00:00-05:00",
                "ends": "2023-09-13T08:00:00-05:00",
                "status": "Actual",
                "messageType": "Update",
                "category": "Met",
                "severity": "Minor",
                "certainty": "Likely",
                "urgency": "Expected",
                "event": "Frost Advisory",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS Green Bay WI",
                "headline": "Frost Advisory issued September 12 at 9:04PM CDT until September 13 at 8:00AM CDT by NWS Green Bay WI",
                "description": "* WHAT...Temperatures as low as 34 will result in frost formation.\n\n* WHERE...Lincoln, Oneida, Vilas, and Forest Counties.\n\n* WHEN...From 2 AM to 8 AM CDT Wednesday.\n\n* IMPACTS...Frost could harm sensitive outdoor vegetation. Sensitive\noutdoor plants may be killed if left uncovered.",
                "instruction": "Take steps now to protect tender plants from the cold.",
                "response": "Prepare",
                "parameters": {
                    "AWIPSidentifier": [
                        "NPWGRB"
                    ],
                    "WMOidentifier": [
                        "WWUS73 KGRB 130204"
                    ],
                    "NWSheadline": [
                        "FROST ADVISORY REMAINS IN EFFECT FROM 2 AM TO 8 AM CDT WEDNESDAY"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "VTEC": [
                        "/O.CON.KGRB.FR.Y.0006.230913T0700Z-230913T1300Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T13:00:00+00:00"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.819daa24faaac81f77b4ef93eaa2ba03ae2bd967.001.1",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -80.77,
                            34.12
                        ],
                        [
                            -80.75999999999999,
                            34.14
                        ],
                        [
                            -80.74,
                            34.15
                        ],
                        [
                            -80.7099999,
                            34.159999899999995
                        ],
                        [
                            -80.55,
                            34.169999999999995
                        ],
                        [
                            -80.5,
                            34.129999999999995
                        ],
                        [
                            -80.48,
                            34.10999999999999
                        ],
                        [
                            -80.38000000000001,
                            34.07999999999999
                        ],
                        [
                            -80.35000000000001,
                            34.04999999999999
                        ],
                        [
                            -80.36000000000001,
                            34.01999999999999
                        ],
                        [
                            -80.39000000000001,
                            33.96999999999999
                        ],
                        [
                            -80.44000000000001,
                            33.92999999999999
                        ],
                        [
                            -80.49000000000001,
                            33.89999999999999
                        ],
                        [
                            -80.66000000000001,
                            33.919999999999995
                        ],
                        [
                            -80.72000000000001,
                            33.94
                        ],
                        [
                            -80.77000000000001,
                            33.96
                        ],
                        [
                            -80.81000000000002,
                            33.99
                        ],
                        [
                            -80.81999990000001,
                            34.04
                        ],
                        [
                            -80.79,
                            34.089999999999996
                        ],
                        [
                            -80.77,
                            34.12
                        ]
                    ]
                ]
            },
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.819daa24faaac81f77b4ef93eaa2ba03ae2bd967.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.819daa24faaac81f77b4ef93eaa2ba03ae2bd967.001.1",
                "areaDesc": "Kershaw, SC; Richland, SC; Sumter, SC",
                "geocode": {
                    "SAME": [
                        "045055",
                        "045079",
                        "045085"
                    ],
                    "UGC": [
                        "SCC055",
                        "SCC079",
                        "SCC085"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/county/SCC055",
                    "https://api.weather.gov/zones/county/SCC079",
                    "https://api.weather.gov/zones/county/SCC085"
                ],
                "references": [],
                "sent": "2023-09-12T21:56:00-04:00",
                "effective": "2023-09-12T21:56:00-04:00",
                "onset": "2023-09-12T21:56:00-04:00",
                "expires": "2023-09-13T01:00:00-04:00",
                "ends": "2023-09-13T01:00:00-04:00",
                "status": "Actual",
                "messageType": "Alert",
                "category": "Met",
                "severity": "Minor",
                "certainty": "Likely",
                "urgency": "Expected",
                "event": "Flood Advisory",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS Columbia SC",
                "headline": "Flood Advisory issued September 12 at 9:56PM EDT until September 13 at 1:00AM EDT by NWS Columbia SC",
                "description": "* WHAT...Flooding caused by excessive rainfall is expected.\n\n* WHERE...A portion of central South Carolina, including the\nfollowing counties, Kershaw, Richland and Sumter.\n\n* WHEN...Until 100 AM EDT.\n\n* IMPACTS...Minor flooding in low-lying and poor drainage areas.\nOverflowing poor drainage areas. Ponding of water in urban or\nother areas is occurring or is imminent.\n\n* ADDITIONAL DETAILS...\n- At 954 PM EDT, Doppler radar indicated heavy rain due to\nthunderstorms. Overflowing poor drainage areas will cause\nminor flooding in the advisory area. Between 1.5 and 2 inches\nof rain has fallen.\n- Additional rainfall amounts of 1 to 2 inches is possible over\nthe area. This additional rain will result in minor flooding.\n- Some locations that will experience flooding include...\nColumbia, Sumter, Shaw Air Base, Oakland, Wateree River\nCorrectional Institution, Dinkins Mill, Boykin, Stateburg,\nRembert, Fort Jackson McCrady Training Center, Cherryvale and\nDalzell.\n- This includes Interstate 20 in South Carolina between mile\nmarkers 86 and 88.\n- http://www.weather.gov/safety/flood",
                "instruction": "Most flooding deaths occur in vehicles. Never drive through a\nflooded roadway or around barricades. Turn around, don't drown.",
                "response": "Avoid",
                "parameters": {
                    "AWIPSidentifier": [
                        "FLSCAE"
                    ],
                    "WMOidentifier": [
                        "WGUS82 KCAE 130156"
                    ],
                    "NWSheadline": [
                        "FLOOD ADVISORY IN EFFECT UNTIL 1 AM EDT WEDNESDAY"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "VTEC": [
                        "/O.NEW.KCAE.FA.Y.0075.230913T0156Z-230913T0500Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T05:00:00+00:00"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.a85d4bad563ca5f735cb0fe9ddb7ebd26938e1db.002.1",
            "type": "Feature",
            "geometry": null,
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.a85d4bad563ca5f735cb0fe9ddb7ebd26938e1db.002.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.a85d4bad563ca5f735cb0fe9ddb7ebd26938e1db.002.1",
                "areaDesc": "Cecil; Northwest Harford; Southeast Harford",
                "geocode": {
                    "SAME": [
                        "024015",
                        "024025"
                    ],
                    "UGC": [
                        "MDZ008",
                        "MDZ507",
                        "MDZ508"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/forecast/MDZ008",
                    "https://api.weather.gov/zones/forecast/MDZ507",
                    "https://api.weather.gov/zones/forecast/MDZ508"
                ],
                "references": [
                    {
                        "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.35342729a2ffc6d057b51b864d1d73be8ebf45ef.001.1",
                        "identifier": "urn:oid:2.49.0.1.840.0.35342729a2ffc6d057b51b864d1d73be8ebf45ef.001.1",
                        "sender": "w-nws.webmaster@noaa.gov",
                        "sent": "2023-09-12T13:44:00-04:00"
                    }
                ],
                "sent": "2023-09-12T21:43:00-04:00",
                "effective": "2023-09-12T21:43:00-04:00",
                "onset": "2023-09-12T23:00:00-04:00",
                "expires": "2023-09-13T05:45:00-04:00",
                "ends": "2023-09-13T11:00:00-04:00",
                "status": "Actual",
                "messageType": "Update",
                "category": "Met",
                "severity": "Severe",
                "certainty": "Possible",
                "urgency": "Future",
                "event": "Flood Watch",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS Baltimore MD/Washington DC",
                "headline": "Flood Watch issued September 12 at 9:43PM EDT until September 13 at 11:00AM EDT by NWS Baltimore MD/Washington DC",
                "description": "* WHAT...Flooding caused by excessive rainfall continues to be\npossible.\n\n* WHERE...Portions of northeast and northern Maryland, including the\nfollowing areas, in northeast Maryland, Cecil. In northern\nMaryland, Northwest Harford and Southeast Harford.\n\n* WHEN...Through Wednesday morning.\n\n* IMPACTS...Excessive runoff may result in flooding of rivers,\ncreeks, streams, and other low-lying and flood-prone locations.\n\n* ADDITIONAL DETAILS...\n- Showers and possible thunderstorms late tonight into\nWednesday morning will be capable of producing intense\nrainfall rates of 1 to 2 inches per hour which may result in\nflooding of small streams and creeks.\n- Please visit www.weather.gov/safety/flood for flood safety\nand preparedness information",
                "instruction": "You should monitor later forecasts and be alert for possible Flood\nWarnings. Those living in areas prone to flooding should be prepared\nto take action should flooding develop.",
                "response": "Prepare",
                "parameters": {
                    "AWIPSidentifier": [
                        "FFALWX"
                    ],
                    "WMOidentifier": [
                        "WGUS61 KLWX 130143"
                    ],
                    "NWSheadline": [
                        "FLOOD WATCH REMAINS IN EFFECT THROUGH WEDNESDAY MORNING"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "EAS-ORG": [
                        "WXR"
                    ],
                    "VTEC": [
                        "/O.CON.KLWX.FA.A.0011.230913T0300Z-230913T1500Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T15:00:00+00:00"
                    ]
                }
            }
        },
        {
            "id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.a85d4bad563ca5f735cb0fe9ddb7ebd26938e1db.001.1",
            "type": "Feature",
            "geometry": null,
            "properties": {
                "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.a85d4bad563ca5f735cb0fe9ddb7ebd26938e1db.001.1",
                "@type": "wx:Alert",
                "id": "urn:oid:2.49.0.1.840.0.35342729a2ffc6d057b51b864d1d73be8ebf45ef.001.1",
                "areaDesc": "Carroll; Northern Baltimore",
                "geocode": {
                    "SAME": [
                        "024013",
                        "024005"
                    ],
                    "UGC": [
                        "MDZ005",
                        "MDZ006"
                    ]
                },
                "affectedZones": [
                    "https://api.weather.gov/zones/forecast/MDZ005",
                    "https://api.weather.gov/zones/forecast/MDZ006"
                ],
                "references": [],
                "sent": "2023-09-12T21:43:00-04:00",
                "effective": "2023-09-12T21:43:00-04:00",
                "onset": "2023-09-12T23:00:00-04:00",
                "expires": "2023-09-13T05:45:00-04:00",
                "ends": "2023-09-13T11:00:00-04:00",
                "status": "Actual",
                "messageType": "Alert",
                "category": "Met",
                "severity": "Severe",
                "certainty": "Possible",
                "urgency": "Future",
                "event": "Flood Watch",
                "sender": "w-nws.webmaster@noaa.gov",
                "senderName": "NWS Baltimore MD/Washington DC",
                "headline": "Flood Watch issued September 12 at 9:43PM EDT until September 13 at 11:00AM EDT by NWS Baltimore MD/Washington DC",
                "description": "* WHAT...Flooding caused by excessive rainfall continues to be\npossible.\n\n* WHERE...Portions of north central and northern Maryland, including\nthe following areas, in north central Maryland, Carroll. In\nnorthern Maryland, Northern Baltimore.\n\n* WHEN...Through Wednesday morning.\n\n* IMPACTS...Excessive runoff may result in flooding of rivers,\ncreeks, streams, and other low-lying and flood-prone locations.\n\n* ADDITIONAL DETAILS...\n- Showers and possible thunderstorms late tonight into\nWednesday morning will be capable of producing intense\nrainfall rates of 1 to 2 inches per hour which may result in\nflooding of small streams and creeks.\n- Please visit www.weather.gov/safety/flood for flood safety\nand preparedness information",
                "instruction": "You should monitor later forecasts and be alert for possible Flood\nWarnings. Those living in areas prone to flooding should be prepared\nto take action should flooding develop.",
                "response": "Prepare",
                "parameters": {
                    "AWIPSidentifier": [
                        "FFALWX"
                    ],
                    "WMOidentifier": [
                        "WGUS61 KLWX 130143"
                    ],
                    "NWSheadline": [
                        "FLOOD WATCH IN EFFECT THROUGH WEDNESDAY MORNING"
                    ],
                    "BLOCKCHANNEL": [
                        "EAS",
                        "NWEM",
                        "CMAS"
                    ],
                    "EAS-ORG": [
                        "WXR"
                    ],
                    "VTEC": [
                        "/O.EXA.KLWX.FA.A.0011.230913T0300Z-230913T1500Z/"
                    ],
                    "eventEndingTime": [
                        "2023-09-13T15:00:00+00:00"
                    ]
                }
            }
        }
    ],
    "title": "Current watches, warnings, and advisories",
    "updated": "2023-09-13T02:15:56+00:00"
}