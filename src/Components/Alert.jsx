import React from "react";

const Alert = ({
    type,
    name,
    message,
    moreExist = false
}) => (
    <div className={"widget alert " + type}>
        <h2>{name}</h2>
        <p>{message}</p>
    </div>
)

export default Alert;