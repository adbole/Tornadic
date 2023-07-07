const InputGroup = ({ children, hasGap = false, isUniform = false }: { 
    children: React.ReactNode, 
    hasGap?: boolean,
    isUniform?: boolean
}) => (
    <div className={`input-group ${hasGap ? "gap" : ""} ${isUniform ? "uniform" : ""}`.replace(/  +/, " ").trim()}>
        {children}
    </div>
);

export default InputGroup;