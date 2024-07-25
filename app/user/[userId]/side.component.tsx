"use client";

import { Accordion, AccordionItem, Skeleton } from "@nextui-org/react";
import { useCookies } from "next-client-cookies";
import { HiAnnotation, HiLink, HiVolumeUp } from "react-icons/hi";

import { ClientCountUp } from "@/components/counter";
import { ApiV1UsersGetResponse, RouteErrorResponse } from "@/typings";

export default function Side({
    user
}: {
    user: ApiV1UsersGetResponse | RouteErrorResponse | undefined;
}) {
    const cookies = useCookies();
    const userExists = user && "id" in user;

    function Counters() {
        return (
            <div className="md:ml-auto grid items-center gap-5 mt-6 md:mt-0">
                <div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                        <HiVolumeUp />
                        Voice
                    </div>

                    {!userExists || !user?.activity
                        ? <Skeleton className="rounded-md mt-1.5 w-20 h-6 mb-1" />
                        :
                        <span className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">
                            {user.activity?.formattedVoicetime}
                        </span>
                    }
                </div>
                <div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                        <HiAnnotation />
                        Messages
                    </div>

                    {!userExists || !user?.activity
                        ? <Skeleton className="rounded-md mt-1.5 w-12 h-6 mb-1" />
                        :
                        <ClientCountUp
                            className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium"
                            end={user.activity.messages || 0}
                        />
                    }
                </div>
                <div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                        <HiLink />
                        Invites
                    </div>

                    {!userExists || !user?.activity
                        ? <Skeleton className="rounded-md mt-1.5 w-8 h-6 mb-1" />
                        :
                        <ClientCountUp
                            className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium"
                            end={user.activity.invites || 0}
                        />
                    }
                </div>
            </div>
        );
    }

    return (
        <div>

            <Accordion
                variant="shadow"
                className="bg-wamellow"
                selectionMode="multiple"
                defaultExpandedKeys={["1"]}
                disableAnimation={cookies.get("reduceMotions") === "true"}
            >
                <AccordionItem
                    key="1"
                    aria-label="user's activity"
                    title={`${userExists ? user.username : "Unknown"}'s Activity`}
                    classNames={{ content: "mb-2 space-y-4" }}
                    subtitle="Activity from all servers"
                >
                    <Counters />
                </AccordionItem>
            </Accordion>
        </div>
    );
}