import { Montserrat } from "next/font/google";
import { ReactNode } from "react";

import { Section } from "@/components/section";
import cn from "@/utils/cn";

import { Commands } from "../commands.component";

const montserrat = Montserrat({ subsets: ["latin"] });

interface Props {
    children: ReactNode
}

export default function RootLayout({
    children
}: Props) {

    return (<>
        <h1
            className={cn(montserrat.className, "lg:text-5xl text-4xl font-bold dark:text-neutral-100 text-neutral-900 break-words mb-2")}
        >
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Wamellow</span>
            {" status"}
        </h1>

        <div
            className="text-lg font-medium mb-6"
        >
            Double check if we just didn&apos;t mess up something.
        </div>

        <div className="mb-12">
            {children}
        </div>

        <Section title="Commands">
            The most popular commands and interactions!
        </Section>

        <Commands limit={100} />
    </>);
}