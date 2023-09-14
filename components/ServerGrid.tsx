import { FunctionComponent } from "react";

import { ApiV1TopguildsGetResponse } from "@/typings";

import ImageReduceMotion from "./ImageReduceMotion";

interface Props {
    guilds: ApiV1TopguildsGetResponse[];
}

const ServerGrid: FunctionComponent<Props> = ({ guilds }) => {
    return (
        <div className="w-full h-52 overflow-hidden rounded-xl">
            <div className="grid grid-flow-col grid-rows-3 w-full md:gap-4 gap-3 rotate-6 relative right-8 bottom-10 md:bottom-20">

                {[...guilds, ...guilds, ...guilds, ...guilds, ...guilds, ...guilds].map((guild) => (
                    <div key={guild.name} className="md:h-32 h-24 md:w-32 w-24">
                        <ImageReduceMotion url={guild.icon?.split(".").slice(0, -1).join(".")} size={128} alt="Server" className="rounded-xl" />
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ServerGrid;