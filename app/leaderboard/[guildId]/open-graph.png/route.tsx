/* eslint-disable @next/next/no-img-element */

import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { truncate } from "@/utils/truncate";

import { getGuild, getTopMembers } from "../api";
import Icon from "../icon.component";
import { LeaderboardProps } from "../layout";

export const revalidate = 3600; // 1 hour

export async function GET(
    request: NextRequest,
    { params }: LeaderboardProps
) {
    let type = request.nextUrl.searchParams.get("type");
    if (type !== "messages" && type !== "voiceminutes" && type !== "invites") type = "messages";

    const guild = await getGuild(params.guildId);
    const members = await getTopMembers(params.guildId, { page: 1, type: "messages" });

    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    return new ImageResponse(
        (
            <div tw="bg-[#07050c] p-18 flex flex-col w-full h-full text-6xl text-white">
                <div tw="flex mb-6">
                    <span tw="text-3xl bg-[#2c2146] text-[#895af6] opacity-80 pt-2 px-4 rounded-xl" style={{ fontWeight: 500 }}>Leaderboard</span>
                </div>
                <div tw="flex mb-3 items-center">
                    <img
                        src={guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : "/discord.png"}
                        tw="h-20 w-20 rounded-2xl relative bottom-3 mr-5"
                        alt=""
                    />
                    <div style={{ fontWeight: 800, fontSize: "5rem" }}>{truncate(guild?.name || "unknown", 20)}</div>
                </div>
                <div tw="text-4xl text-gray-500 mb-42" style={{ fontWeight: 500 }}>Explore the vibrant community dynamics</div>


                <div tw="flex justify-between">
                    {members.slice(0, 3).map((member) => (
                        <div key={member.id} tw="flex flex-col">
                            <div tw="flex items-center mb-2 text-5xl" style={{ fontWeight: 600 }}>
                                <img
                                    src={member?.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png` : "/discord.png"}
                                    tw="h-14 w-14 rounded-full mb-2.5 mr-4"
                                    alt=""
                                />
                                {truncate(member.globalName || member.username || "unknown", 10)}
                            </div>

                            <div tw="text-3xl text-gray-400 flex text-3xl" style={{ fontWeight: 500 }}>
                                <span tw="mr-2">{intl.format(member.activity.messages)}</span>
                                <Icon type={type as "messages"} />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Poppins",
                    data: await readFile(process.cwd() + "/assets/Poppins-Regular.ttf"),
                    style: "normal",
                    weight: 400
                },
                {
                    name: "Poppins",
                    data: await readFile(process.cwd() + "/assets/Poppins-Medium.ttf"),
                    style: "normal",
                    weight: 500
                },
                {
                    name: "Poppins",
                    data: await readFile(process.cwd() + "/assets/Poppins-SemiBold.ttf"),
                    style: "normal",
                    weight: 600
                },
                {
                    name: "Poppins",
                    data: await readFile(process.cwd() + "/assets/Poppins-ExtraBold.ttf"),
                    style: "normal",
                    weight: 800
                }
            ]
        }
    );
}