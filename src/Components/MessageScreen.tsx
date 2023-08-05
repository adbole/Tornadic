import { Tornadic } from "svgs/icon";


export default function MessageScreen({ children }: { children: React.ReactNode }) {
    return (
        <div id="message-screen">
            <Tornadic />
            <div>{children}</div>
        </div>
    );
}
