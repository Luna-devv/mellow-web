import { ApiV1TopguildsGetResponse } from "@/typings";

import ImageReduceMotion from "./image-reduce-motion";

interface Props {
    guilds: ApiV1TopguildsGetResponse[];
}

export default function ServerGrid({ guilds }: Props) {
    return (
        <div className="w-full h-52 overflow-hidden rounded-xl">
            <div className="grid grid-flow-col grid-rows-3 w-full md:gap-4 gap-3 rotate-6 relative right-8 bottom-10 md:bottom-20">
                {guilds.map((guild, i) => (
                    <div key={"gridGuild-" + guild.name + i} className="md:h-32 h-24 md:w-32 w-24">
                        <ImageReduceMotion url={guild.icon?.split(".").slice(0, -1).join(".")} size={128} alt="server" className="rounded-xl" />
                    </div>
                ))}

            </div>
        </div>
    );
}