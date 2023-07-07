const Button = ({ 
    children, 
    onClick,
    ...excess 
}: React.ButtonHTMLAttributes<HTMLButtonElement> ) => (
    <button type="button" className="primary" onClick={onClick} {...excess}>{children}</button>
);

export default Button;