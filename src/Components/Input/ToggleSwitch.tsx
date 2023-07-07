const ToggleSwitch = ({ label, onChange }: { 
    label: string, 
    onChange: React.ChangeEventHandler<HTMLInputElement> 
}) => (
    <label className="switch">
        <input type="checkbox" onChange={onChange}/>
        <span className="switch-slider">{label}</span>
    </label>
);

export default ToggleSwitch;