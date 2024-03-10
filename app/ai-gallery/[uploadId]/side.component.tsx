"use client";

import { Accordion, AccordionItem, Button, Chip, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { FaReddit, FaTwitter } from "react-icons/fa";
import { HiHand, HiShare, HiUserGroup } from "react-icons/hi";

import { webStore } from "@/common/webstore";
import Ad from "@/components/ad";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { formatDate } from "@/components/time";
import { AnalyticsError, AnalyticsResponse } from "@/lib/analytics";
import { ApiError, ApiV1GuildsGetResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

import { ExtendedUpload } from "../api";

export default function Side({
    upload,
    guild,
    analytics
}: {
    upload: ExtendedUpload | ApiError;
    guild: ApiV1GuildsGetResponse | ApiError | undefined;
    analytics: { results: AnalyticsResponse[] } | AnalyticsError | undefined;
}) {
    const web = webStore((w) => w);

    return (
        <div className="flex flex-col gap-3">

            {"id" in upload &&
                <div className="flex gap-2 w-full">
                    <CopyToClipboardButton
                        className="w-full !justify-start"
                        title="Share this page"
                        text={getCanonicalUrl("ai-gallery", upload.id as string)}
                        icon={<HiShare />}
                    />
                    <Tooltip content="Share on Reddit" delay={0} closeDelay={0} showArrow>
                        <Button
                            as={Link}
                            href={`https://reddit.com/submit?title=${encodeURIComponent(`Created an /image with a ${upload.model} AI model on wamellow.com`)}&text=${`Hey! I created this AI /image with the ${upload.model} model and the prompt: "${encodeURIComponent(upload.prompt)}" ${encodeURIComponent("\n\n")}${getCanonicalUrl("ai-gallery", upload.id as string)}`}`}
                            target="_blank"
                            isIconOnly
                        >
                            <FaReddit />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Share on Twitter/X" delay={0} closeDelay={0} showArrow>
                        <Button
                            as={Link}
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Created an #ai /image with a ${upload.model} AI model on on wamellow.com! The query is "${upload.prompt}"`)}&url=${encodeURIComponent(getCanonicalUrl("ai-gallery", upload.id as string))}&hashtags=${encodeURIComponent("wamellow,discord")}`}
                            target="_blank"
                            isIconOnly
                        >
                            <FaTwitter />
                        </Button>
                    </Tooltip>
                </div>
            }

            <Ad
                title="/image AI for free"
                description="Create your own amazing AI /image-s with Wamellow for free in your Discord Server using the best SDXL models and 40+ more!"
            />

            <Accordion
                variant="shadow"
                className="bg-wamellow"
                selectionMode="multiple"
                defaultExpandedKeys={["1"]}
                disableAnimation={web.reduceMotions}
            >
                <AccordionItem
                    key="1"
                    aria-label="about"
                    title="About"
                    classNames={{ content: "mb-2 space-y-4" }}
                >

                    <div className="flex items-center justify-between">
                        <span>Created</span>
                        <Chip
                            className="select-none"
                            radius="sm"
                        >
                            {"createdAt" in upload ?
                                formatDate(upload.createdAt as string, "en-US")
                                :
                                "unknown"
                            }
                        </Chip>
                    </div>

                    {analytics && "results" in analytics &&
                        <div className="flex items-center justify-between">
                            <span>Views</span>
                            <Chip
                                className="select-none"
                                radius="sm"
                            >
                                {Array.isArray(analytics.results) && analytics.results.length ?
                                    (analytics.results[0].pageviews)
                                    :
                                    "unknown"
                                }
                                {" "}
                                views
                            </Chip>
                        </div>
                    }

                    {"author" in upload &&
                        <div className="flex items-center justify-between">
                            <span>Author</span>
                            <Chip
                                className="flex select-none"
                                startContent={
                                    <ImageReduceMotion
                                        className="rounded-full"
                                        alt="uploader's avatar"
                                        url={"https://cdn.discordapp.com/avatars/" + upload.authorId + "/" + upload.author.avatar}
                                        size={16}
                                    />
                                }
                            >
                                @{upload.author.username}
                            </Chip>
                        </div>
                    }

                    <div className="flex items-center justify-between">
                        <span>Rating</span>
                        <Chip
                            className="font-bold select-none"
                            color={"nsfw" in upload && upload.nsfw ? "danger" : "default"}
                            radius="sm"
                            startContent={
                                <span className="mx-1">
                                    {"nsfw" in upload && upload.nsfw ? <HiHand /> : <HiUserGroup />}
                                </span>
                            }
                        >
                            {"nsfw" in upload && upload.nsfw ? "Mature" : "Everyone"}
                        </Chip>
                    </div>

                </AccordionItem>
            </Accordion>

            <Accordion
                variant="shadow"
                className="bg-wamellow"
                selectionMode="multiple"
                disableAnimation={web.reduceMotions}
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
                        <div className="text-lg text-neutral-200 font-semibold">{guild.name}</div>
                        <div className="text-sm font-medium">View leaderboard</div>
                    </div>
                </Link>
            }

            <div>
                The image has been generated by artificial intelligence (AI) and not by a human creator. Wamellow and its developers disclaim any responsibility for the content of the images and reserve all rights to the media.
            </div>


        </div >
    );

}