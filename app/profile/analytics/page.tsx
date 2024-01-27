"use client";

import { JSX, SVGProps, useEffect, useState } from "react";
import { HiIdentification } from "react-icons/hi";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import Badge from "@/components/badge";
import Box from "@/components/box";
import { StatsBar } from "@/components/counter";
import { ScreenMessage } from "@/components/screen-message";
import { Nekostic, RouteErrorResponse } from "@/typings";
import { convertMonthToName } from "@/utils/time";

interface CalcUses {
    snapshot: string;
    uses: number;
    users: number
}

interface CalcNames {
    name: string;
    count: number;
}

export default function Home() {
    const [error, setError] = useState<string>();
    const [data, setData] = useState<Nekostic[]>();

    useEffect(() => {

        fetch(process.env.NEXT_PUBLIC_NEKOSTIC as string, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as Nekostic[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setData(response.sort((a, b) => new Date(a.snapshot).getTime() - new Date(b.snapshot).getTime()));
                        break;
                    }
                    default: {
                        setData([]);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching analytics data");
            });

    }, []);

    if (error) {
        return <>
            <ScreenMessage
                title="Something went wrong.."
                description={error}
                href="/profile"
                button="Go back to overview"
                icon={<HiIdentification />}
            />
        </>;
    }

    if (!data?.length) return <></>;

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    return (
        <div className="flex flex-col gap-2">

            <StatsBar
                items={[
                    {
                        name: "All time Unique Users",
                        number: data.map((enty) => enty.users).reduce((prev, curr) => prev + curr),
                        gained: data.filter((entry) => entry.snapshot === `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, "0")}-${yesterday.getDate().toString().padStart(2, "0")}`).map((enty) => enty.users).reduce((prev, curr) => prev + curr, 0),
                        append: "yesterday"
                    },
                    {
                        name: "All time Command Uses",
                        number: data.map((enty) => enty.uses).reduce((prev, curr) => prev + curr),
                        gained: data.filter((entry) => entry.snapshot === `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, "0")}-${yesterday.getDate().toString().padStart(2, "0")}`).map((enty) => enty.uses).reduce((prev, curr) => prev + curr, 0),
                        append: "yesterday"
                    },
                    {
                        name: "--",
                        number: 1,
                        gained: 0,
                        append: "yesterday"
                    }
                ]}
            />

            <span className="h-2" />

            <ChartArea name="Command Usage" data={data} dataKey="uses" />
            <ChartArea name="Command Users" data={data} dataKey="users" />

            <ChartBar name="Commands Used" data={data} dataKey="count" />

        </div>
    );
}

function ChartArea(options: { name: string; data: Nekostic[]; dataKey: keyof Nekostic }) {
    return (
        <Box none className="dark:bg-wamellow bg-wamellow-100 w-full rounded-md">

            <div className="flex mx-10 mt-5 ">
                <span className="text-sm">{options.name}</span>
                <Badge text="Lorem ipsum" />
            </div>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <AreaChart
                    data={calcUses(options.data)}
                    margin={{
                        top: 25,
                        right: 40,
                        bottom: 5
                    }}
                >
                    <XAxis dataKey="snapshot" tickFormatter={(str: string) => `${str.split("-")[1]}/${str.split("-")[2]}`} style={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis style={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 14, paddingInline: "8px", paddingBlock: "6px" }} labelStyle={{ marginBottom: ~4, color: "#000000", fontWeight: 400 }} itemStyle={{ marginBottom: ~4 }} labelFormatter={(label: string) => `${convertMonthToName(new Date(label).getMonth())} ${label.split("-")[2]}`} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <Area type="monotone" dataKey={options.dataKey} strokeWidth={2} stroke="rgb(124 58 237)" fill="rgb(139 92 246)" style={{ opacity: 0.9 }} />
                </AreaChart>
            </ResponsiveContainer>

        </Box>
    );
}

function ChartBar(options: { name: string; data: Nekostic[]; dataKey: keyof CalcNames }) {
    return (
        <Box none className="dark:bg-wamellow bg-wamellow-100 w-full rounded-md">

            <div className="flex mx-10 mt-5 ">
                <span className="text-sm">{options.name}</span>
                <Badge text="Lorem ipsum" />
            </div>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <BarChart
                    data={calcNameOccurrences(options.data)}
                    margin={{
                        top: 25,
                        right: 40,
                        bottom: 5
                    }}
                >
                    <XAxis dataKey="name" style={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis style={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={false} contentStyle={{ borderRadius: "8px", fontSize: 14, paddingInline: "8px", paddingBlock: "6px" }} labelStyle={{ marginBottom: ~4, color: "#000000", fontWeight: 400 }} itemStyle={{ marginBottom: ~4 }} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <Bar dataKey={options.dataKey} shape={<RoundedBar />} fill="rgb(86, 61, 146)" style={{ borderRadius: 10, overflow: "hidden" }} />
                </BarChart>
            </ResponsiveContainer>

        </Box>
    );
}

function getPath(x: number, y: number, width: number, height: number) {
    const x2 = x + width;
    const y2 = y + height;

    const cornerRadius = 8;

    return `
        M${x},${y + cornerRadius}
        A${cornerRadius},${cornerRadius} 0 0 1 ${x + cornerRadius},${y}
        L${x2 - cornerRadius},${y}
        A${cornerRadius},${cornerRadius} 0 0 1 ${x2},${y + cornerRadius}
        L${x2},${y2}
        L${x},${y2}
        L${x},${y + cornerRadius}
        Z
    `;
}

function RoundedBar(props: JSX.IntrinsicAttributes & SVGProps<SVGPathElement>) {
    return <path d={getPath(props.x as number, props.y as number, props.width as number, props.height as number)} {...props} />;
}

interface SnapshotData {
    [snapshot: string]: {
        uses: number;
        users: number;
    };
}

function calcUses(data: Nekostic[]): CalcUses[] {
    const snapshotData: SnapshotData = {};

    for (const item of data) {
        const { snapshot, uses, users } = item;
        if (!snapshotData[snapshot]) {
            snapshotData[snapshot] = { uses: 0, users: 0 };
        }
        snapshotData[snapshot].uses += uses;
        snapshotData[snapshot].users += users;
    }

    return Object.entries(snapshotData).map(([snapshot, data]) => ({
        snapshot,
        ...data
    }));
}

function calcNameOccurrences(data: Nekostic[]): CalcNames[] {
    const nameOccurrences: Record<string, number> = {};

    for (const item of data) {
        if (nameOccurrences[item.name]) nameOccurrences[item.name] += item.uses;
        else nameOccurrences[item.name] = item.uses;
    }

    return Object.entries(nameOccurrences).map(([name, count]) => ({ name, count }));
}