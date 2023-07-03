import Image from "next/image";
import React, { FunctionComponent } from "react";

interface Props {
    children: React.ReactNode;

    user: {
        username: string;
        avatar: string;
        bot: boolean;
    }
}

const DiscordMessage: FunctionComponent<Props> = ({ children, user }) => {

    function formatTime(date: Date) {
        const timeString = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
        return `Today at ${timeString}`;
    }

    return (
        <div className="w-full text-slate-100">
            <div className="flex w-full">
                <Image src={user.avatar} height={40} width={40} alt="" className="rounded-full h-10 w-10" />
                <div className="ml-3 w-full">
                    <div className="flex items-center gap-2">
                        <div className="text-md font-medium">{user.username}</div>
                        <div className="text-xs text-neutral-400">{formatTime(new Date())}</div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DiscordMessage;