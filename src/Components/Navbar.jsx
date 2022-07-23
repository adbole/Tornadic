import React from "react"
import {ReactComponent as DashboardFill} from '../svgs/dashboard-fill.svg'
import {ReactComponent as MapFill} from '../svgs/map-fill.svg'
import {ReactComponent as ExclamationCircleFill} from '../svgs/exclamation-circle-fill.svg'

const NavButton = (props) => (
    <a href={props.href} title={props.title}>
        {props.children}
    </a>
)

const Navbar = () => (
    <nav>
        <NavButton href={"/"} title={"Dashboard"}>
            <DashboardFill />
        </NavButton>
        <NavButton href={"/"} title={"Radar"}>
            <MapFill />
        </NavButton>
        <NavButton href={"/"} title={"Alerts"}>
            <ExclamationCircleFill />
        </NavButton>
    </nav>
)

export default Navbar;