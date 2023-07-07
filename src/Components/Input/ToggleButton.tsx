import React from "react";


const ToggleButton = ({ label, name, defaultChecked = false, onClick }: { 
    label: string,
    name: string, 
    defaultChecked?: boolean, 
    onClick: React.MouseEventHandler<HTMLDivElement>
}) => {
    const id = React.useId();
    
    return (
        <div className="toggle-button">
            <input type="radio" name={name} id={id} defaultChecked={defaultChecked} onClick={onClick}/>
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default ToggleButton;