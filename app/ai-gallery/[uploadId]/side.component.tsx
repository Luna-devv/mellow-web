"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { HiHand, HiUserGroup } from "react-icons/hi";

import Ad from "@/components/ad";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { Share } from "@/components/share";
import { formatDate } from "@/components/time";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsError, AnalyticsResponse } from "@/lib/analytics";
import type { ApiError, ApiV1GuildsGetResponse, ApiV1UploadGetResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

export default function Side({
    upload,
    guild,
    analytics
}: {
    upload: ApiV1UploadGetResponse | ApiError;
    guild: ApiV1GuildsGetResponse | ApiError | undefined;
    analytics: { results: AnalyticsResponse[]; } | AnalyticsError | undefined;
}) {
    const cookies = useCookies();

    return (
        <div className="flex flex-col gap-3">
            {"prompt" in upload &&
                <Share
                    title="Share image"
                    url={getCanonicalUrl("ai-gallery", upload.id)}
                    text={`${upload.author.username} created an #ai image with the #wamellow bot for #discord using ${upload.model}!`}
                />
            }

            <Ad
                title="/image AI for free"
                description="Create your own amazing AI /image's with Wamellow for free in your Discord Server using the best SDXL models and 40+ more!"
            />

            <Accordion
                variant="shadow"
                className="bg-wamellow"
                selectionMode="multiple"
                defaultExpandedKeys={["1"]}
                disableAnimation={cookies.get("reduceMotions") === "true"}
            >
                <AccordionItem
                    key="1"
                    aria-label="about"
                    title="About"
                    classNames={{ content: "mb-2 space-y-4" }}
                >

                    <div className="flex items-center justify-between">
                        <span>Created</span>
                        <Badge>
                            {"createdAt" in upload ?
                                formatDate(upload.createdAt as string, "en-US")
                                :
                                "unknown"
                            }
                        </Badge>
                    </div>

                    {analytics && "results" in analytics &&
                        <div className="flex items-center justify-between">
                            Views
                            <Badge>
                                {Array.isArray(analytics.results) && analytics.results.length ?
                                    (analytics.results[0].pageviews)
                                    :
                                    "unknown"
                                }
                                {" "}
                                views
                            </Badge>
                        </div>
                    }

                    {"author" in upload &&
                        <div className="flex items-center justify-between">
                            Author
                            <Badge className="flex">
                                <ImageReduceMotion
                                    className="rounded-full relative right-1"
                                    alt="uploader's avatar"
                                    url={"https://cdn.discordapp.com/avatars/" + upload.authorId + "/" + upload.author.avatar}
                                    size={16}
                                />

                                {upload.author.username}

                                {upload.author.bot &&
                                    <Badge
                                        className="relative left-1"
                                        color="secondary"
                                        variant="flat"
                                        size="xs"
                                    >
                                        BOT
                                    </Badge>
                                }
                            </Badge>
                        </div>
                    }

                    <div className="flex items-center justify-between">
                        Rating
                        <Badge
                            className="font-bold select-none"
                            variant={"nsfw" in upload && upload.nsfw ? "destructive" : "default"}
                        >
                            {"nsfw" in upload && upload.nsfw
                                ? <HiHand />
                                : <HiUserGroup />
                            }
                            {"nsfw" in upload && upload.nsfw ? "Mature" : "Everyone"}
                        </Badge>
                    </div>

                </AccordionItem>
            </Accordion>

            <Accordion
                variant="shadow"
                className="bg-wamellow"
                selectionMode="multiple"
                disableAnimation={cookies.get("reduceMotions") === "true"}
            >
                <AccordionItem
                    key="1"
                    aria-label="command"
                    title="Command"
                    classNames={{ content: "mb-2 space-y-4" }}
                    subtitle="Copy it and run it in Discord"
                >
                    {"prompt" in upload &&
                        <span className="select-all">
                            /image query: {upload?.prompt} {upload?.negativePrompt && `negative-query: ${upload?.negativePrompt}`} model: {upload?.model}
                        </span>
                    }
                </AccordionItem>
            </Accordion>

            {guild && "id" in guild &&
                <Link
                    href={getCanonicalUrl("leaderboard", guild.id, "?utm_source=wamellow.com&utm_medium=ai-gallery")}
                    target="_blank"
                    className="flex gap-3 items-center border-2 border-wamellow p-3 rounded-lg shadow-md"
                >
                    <ImageReduceMotion
                        className="rounded-full h-12 w-12"
                        alt="Server icon"
                        url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                        size={56}
                    />

                    <div>
                        <div className="text-lg text-neutral-200 font-semibold truncate">{guild.name}</div>
                        <div className="text-sm font-medium">View leaderboard</div>
                    </div>
                </Link>
            }

            <div className="hidden xl:block">
                The image has been generated by artificial intelligence (AI) and not by a human creator. Wamellow and its developers disclaim any responsibility for the content of the images and reserve all rights to the media.
            </div>

        </div>
    );

}