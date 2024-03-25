"use client";

import Image from "next/image";
import { useQuery } from "react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import Box from "@/components/box";
import { StatsBar } from "@/components/counter";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { NekosticResponse } from "@/typings";
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
    const url = "" as const;

    const { isLoading, data, error } = useQuery(
        ["nekostic", "statistics"],
        () => getData<NekosticResponse[]>(url, process.env.NEXT_PUBLIC_NEKOSTIC as string),
        cacheOptions
    );

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                top="0rem"
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
                <Image src={SadWumpusPic} alt="" height={141} width={124} />
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    data.sort((a, b) =>
        new Date(a.snapshot).getTime() - new Date(b.snapshot).getTime()
    );

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

function ChartArea(options: { name: string; data: NekosticResponse[]; dataKey: keyof NekosticResponse }) {
    return (
        <Box none className="dark:bg-wamellow bg-wamellow-100 w-full rounded-md">

            <div className="flex mx-10 mt-5 ">
                <span className="text-sm">{options.name}</span>
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
                    <XAxis
                        axisLine={false}
                        dataKey="snapshot"
                        tick={<CustomXAxisTick />}
                        tickFormatter={(str: string) => `${str.split("-")[1]}/${str.split("-")[2]}`}
                    />
                    <YAxis
                        style={{ fontSize: 12, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: 14, paddingInline: "8px", paddingBlock: "6px" }}
                        labelStyle={{ marginBottom: ~4, color: "#000000", fontWeight: 400 }}
                        itemStyle={{ marginBottom: ~4 }}
                        labelFormatter={(label: string) => `${convertMonthToName(new Date(label).getMonth())} ${label.split("-")[2]}`}
                    />
                    <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.1}
                        vertical={false}
                    />
                    <Area
                        type="monotone"
                        dataKey={options.dataKey}
                        strokeWidth={2}
                        stroke="rgb(124 58 237)"
                        fill="rgb(139 92 246)"
                        style={{ opacity: 0.9 }}
                    />
                </AreaChart>
            </ResponsiveContainer>

        </Box>
    );
}

function ChartBar(options: { name: string; data: NekosticResponse[]; dataKey: keyof CalcNames }) {
    const data = calcNameOccurrences(options.data)
        .filter((entry) =>
            entry.name !== "eval" &&
            entry.name !== "shell" &&
            entry.name !== "deploycommands" &&
            entry.name !== "emotes" &&
            entry.name !== "giveaway"
        );

    return (
        <Box none className="dark:bg-wamellow bg-wamellow-100 w-full rounded-md">

            <div className="flex mx-10 mt-5 ">
                <span className="text-sm">{options.name}</span>
            </div>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <BarChart
                    data={data}
                    margin={{
                        top: 25,
                        right: 40,
                        bottom: 5
                    }}
                >
                    <XAxis
                        axisLine={false}
                        dataKey="name"
                        tick={<CustomXAxisTick />}
                    />
                    <YAxis
                        style={{ fontSize: 12, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: 14, paddingInline: "8px", paddingBlock: "6px" }}
                        labelStyle={{ marginBottom: ~4, color: "#000000", fontWeight: 400 }}
                        itemStyle={{ marginBottom: ~4 }}
                        cursor={false}
                    />
                    <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.1}
                        vertical={false}
                    />
                    <Bar
                        dataKey={options.dataKey}
                        fill="rgb(86, 61, 146)"
                        radius={[5, 5, 0, 0]}
                    >
                        {data.map((_, index) =>
                            <Cell
                                key={"cell-" + index}
                            />
                        )}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

        </Box>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomXAxisTick(props: any) {
    const { x, y, payload } = props;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill="#666"
                transform="rotate(-35)"
                className="text-[11px] font-semibold"
            >
                {payload.value}
            </text>
        </g>
    );
}

interface SnapshotData {
    [snapshot: string]: {
        uses: number;
        users: number;
    };
}

function calcUses(data: NekosticResponse[]): CalcUses[] {
    const snapshotData: SnapshotData = {};

    for (const item of data) {
        const { snapshot, uses, users } = item;
        if (!snapshotData[snapshot]) {
            snapshotData[snapshot] = { uses: 0, users: 0 };
        }
        snapshotData[snapshot].uses += uses;
        snapshotData[snapshot].users += users;
    }

    return Object
        .entries(snapshotData)
        .map(([snapshot, data]) => ({
            snapshot,
            ...data
        }));
}

function calcNameOccurrences(data: NekosticResponse[]): CalcNames[] {
    const nameOccurrences: Record<string, number> = {};

    for (const item of data) {
        if (nameOccurrences[item.name]) nameOccurrences[item.name] += item.uses;
        else nameOccurrences[item.name] = item.uses;
    }

    return Object
        .entries(nameOccurrences)
        .map(([name, count]) => ({
            name,
            count
        }));
}