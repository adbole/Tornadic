import { Tornadic } from "svgs/icon";

const MessageScreen = ({children}: {children: React.ReactNode}) => (
    <div id="message-screen">
        <Tornadic/>
        <div>
            {children}
        </div>
    </div>
);

export default MessageScreen;