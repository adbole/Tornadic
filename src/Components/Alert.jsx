import React from "react";
import { Widget } from "./BaseComponents";

const Alert = ({
    type,
    name,
    message,
    moreExist = false
}) => (
    <Widget class={"alert " + type}>
        <h2>{name}</h2>
        <p>{message}</p>
    </Widget>
)

export default Alert;