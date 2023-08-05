export default function Button({
    children,
    onClick,
    ...excess
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button type="button" className="primary" onClick={onClick} {...excess}>
            {children}
        </button>
    );
}
