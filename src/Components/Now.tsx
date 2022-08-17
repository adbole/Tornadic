const Now = (props: {
    location: string,
    currentTemp: number,
    status: string,
    feelsTemp: number
}
) => (
    <div id="now">
        <p>{props.location}</p>

        <p id="current">{props.currentTemp}</p>

        <p>{props.status}</p>
        <p>Feels like <span>{props.feelsTemp}</span>°</p>
    </div>
)

export default Now;