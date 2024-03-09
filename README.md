![TornadicCollage](https://github.com/adbole/Tornadic/assets/109166687/6b744f7a-9caf-4ef2-b46d-6d8360df31fc)

## See weather data for your current location
![Screenshot_8-3-2024_234644_localhost](https://github.com/adbole/Tornadic/assets/109166687/1333c53d-805a-4796-a777-91e8860adb3f)


## Stay aware of severe weather with alerts from the NWS
![Screenshot_8-3-2024_23717_localhost](https://github.com/adbole/Tornadic/assets/109166687/8fa2a898-7f59-4585-867e-a844a294c140)
![Screenshot_8-3-2024_232437_localhost](https://github.com/adbole/Tornadic/assets/109166687/77b17ecd-11bb-40a6-a38b-2b223a9b28c9)

## See current relfectivity products and satellite imagery with the Radar.
![311414783-d1c3ee17-5801-4fb6-89ab-581d93b0ea4f](https://github.com/adbole/Tornadic/assets/109166687/17f408f4-953e-4f90-9a78-6f603fd628a0)


# Additional Features
- Peek at any location's weather and alerts by holding on the Radar.
- See all weather alerts for the nation in Radar (must enable Radar Alert Mode in settings).
- Live backgrounds representing current condition.

# Data Providers
- Weather, AirQuality, and Geocoding data provided by [Open-Meteo](https://open-meteo.com/)
- Weather Alerts and Location data provided by the [National Weather Service](https://www.weather.gov/documentation/services-web-api)
- Radar provided by [RainViewer](https://www.rainviewer.com/)

# Data Refresh
This application automatically refreshes data in the following situations:
- Regained Focus: SWR will get new data when you return to the app.
- Every next hour: SWR is set to get new forecast data at the next hour.
- Every ~35 seconds: When alert data is received from the NWS, the expiration header is read to determine when the next alert data should be fetched. This interval is usually 30 seconds, however 5 seconds are added to the expiration time to help prevent over-fetching when new data may not be ready.
- Every 30 minutes: RainViewer provides 30 minute forecast, so the time of the last forecast tile is used to determine when the next forecast should be fetched.

# United States Only
This app currently only works within the United States. While Open-Meteo does provide weather forecasting data for regions outside the U.S., the National Weather Service doesn't. The NWS API is used to get the name of your location, and to provide weather alerts. It is because of these reasons it wont work as I wouldn't want to provide a degraded experience and will therefore show an error when the NWS API won't work while the Open-Meteo one will.
