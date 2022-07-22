import React from "react"

const NavButton = ({
    icon = ''
}) => (
    <button>
        <i className={`icon ${icon}`}></i>
    </button>
)

export const Navbar = () => (
    <React.Fragment>
        <NavButton />
        <NavButton />
        <NavButton />
    </React.Fragment>
)