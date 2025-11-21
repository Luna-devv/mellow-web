import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateString, getTimeAgo } from "@/utils/time";
import { actor, getVoices } from "@/utils/tts";
import { motion } from "framer-motion";
import {
    useEffect,
    useRef
} from "react";
import { HiPencil, HiPlay, HiRefresh, HiSpeakerphone } from "react-icons/hi";

import { HistoryItem, State } from "./use-history";

const springAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.7
        }
    }
} as const;

export function History({
    history,
    error,
    state,
    ensureUrl,
    fallbackVoice,
    onPlay,
    onRefill
}: {
    history: HistoryItem[];
    error: string | null;
    state: State;
    ensureUrl: (item: HistoryItem) => string;
    fallbackVoice: string;
    onPlay: (url: string) => void;
    onRefill: (text: string, voice: string) => void;
}) {
    const init = useRef(false);

    useEffect(() => {
        if (state === State.Loading) return;
        init.current = true;

        return () => {
            init.current = false;
        };
    }, [state]);

    if (error) {
        return <div className="text-sm text-red-400">{error}</div>;
    }

    if (state === State.Loading) {
        return (
            <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-lg" style={{ opacity: 1 / (i * 2) }} />
                ))}
            </div>
        );
    }

    if (!history.length) {
        return (
            <div className="rounded-lg bg-wamellow px-4 py-6 text-sm text-neutral-400">
                Generated clips will show up here for quick replays.
            </div>
        );
    }

    return (
        <ScrollArea className="h-full lg:h-200 xl:h-[calc(100vh-37rem)]">
            <motion.div
                variants={{
                    hidden: { opacity: 1, scale: 0 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            delayChildren: 0.3,
                            staggerChildren: 0.2
                        }
                    }
                }}
                initial={init.current ? "visible" : "hidden"}
                animate="visible"
                className="flex flex-col gap-3"
            >
                {history.map((item) => (
                    <HistoryItem
                        key={item.id}
                        item={item}
                        fallbackVoice={fallbackVoice}
                        onPlay={onPlay}
                        onRefill={onRefill}
                        ensureUrl={ensureUrl}
                    />
                ))}
            </motion.div>
        </ScrollArea>
    );
}

function HistoryItem({
    item,
    fallbackVoice,
    onPlay,
    onRefill,
    ensureUrl
}: {
    item: HistoryItem;
    fallbackVoice: string;
    onPlay: (url: string) => void;
    onRefill: (text: string, voice: string) => void;
    ensureUrl: (item: HistoryItem) => string;
}) {
    const createdAt = new Date(item.createdAt);

    return (
        <motion.div
            className="flex flex-col gap-2 bg-wamellow p-4 rounded-lg"
            variants={springAnimation}
        >
            <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-white/10 text-white">
                    <HiSpeakerphone className="mr-1 inline-block" />
                    {actor[item.voice]
                        ? getVoices(item.voice)[0]
                        : "Voice"}
                </Badge>
                <span className="text-xs text-neutral-400 ml-auto">
                    {createdAt.getDate() === new Date().getDate() && createdAt.getMonth() === new Date().getMonth() && createdAt.getFullYear() === new Date().getFullYear()
                        ? getTimeAgo(createdAt)
                        : getDateString(createdAt, "f")
                    }
                </span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-neutral-200">{item.text}</p>
            <div className="mt-3 flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onPlay(ensureUrl(item))}
                >
                    <HiPlay className="mr-1" /> Play
                </Button>
                <Button
                    size="sm"
                    onClick={() => {
                        const normalizedVoice = actor[item.voice] ? item.voice : fallbackVoice;
                        onRefill(item.text, normalizedVoice);
                    }}
                >
                    <HiPencil className="mr-1" /> Edit
                </Button>
            </div>
        </motion.div>
    );
}