import Image from "next/image";
import React, { FunctionComponent } from "react";
import { HiCheck } from "react-icons/hi";

interface Props {
    children: React.ReactNode;
    mode: "DARK" | "LIGHT";

    user: {
        username: string;
        avatar: string;
        bot: boolean;
    }
}

const DiscordMessage: FunctionComponent<Props> = ({ children, user, mode }) => {

    function formatTime(date: Date) {
        const timeString = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
        return `Today at ${timeString}`;
    }

    return (
        <div className={`w-full ${mode === "DARK" ? "text-neutral-100" : "text-neutral-900"}`}>
            <div className="flex w-full">
                <Image src={user.avatar} height={40} width={40} alt="" className="rounded-full h-10 w-10" />
                <div className="ml-3 w-full">
                    <div className="flex items-center gap-1">
                        <div className="text-md font-medium">{user.username}</div>
                        {user.bot && <div className="text-xxs text-white bg-blurple rounded py-[1px] px-1 flex items-center">
                            <HiCheck />
                            <span className="ml-1">BOT</span>
                        </div>
                        }
                        <div className={`text-xs ml-1 ${mode === "DARK" ? "text-neutral-400" : "text-neutral-600"}`}>{formatTime(new Date())}</div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DiscordMessage;