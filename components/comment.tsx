import { Patrick_Hand } from "next/font/google";
import Image, { type StaticImageData } from "next/image";
import { HiChevronRight } from "react-icons/hi";

import { cn } from "@/utils/cn";

const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

interface Props {
    username: string;
    bio?: React.ReactNode;
    avatar: string | StaticImageData;
    content: string | React.ReactNode;
}

export default function Comment({
    username,
    bio,
    avatar,
    content
}: Props) {
    return (
        <div className="w-full mb-6 mt-9">
            <div className="flex gap-4 items-center mb-2">
                <span className="flex items-center gap-3">
                    <Image
                        alt="users's profile picture"
                        className="w-12 h-12 rounded-full"
                        height={64}
                        src={avatar}
                        width={64}
                    />
                    <div>
                        <span className="text-xl font-medium dark:text-neutral-200 text-neutral-800">
                            {username}
                        </span> <br />
                        <span className="dark:text-neutral-300 text-neutral-700">
                            {bio}
                        </span>
                    </div>
                </span>
                <HiChevronRight className="w-8 h-8" />
            </div>
            <span className={cn(handwritten.className, "text-2xl break-words")}>
                „{content}“
            </span>
        </div>
    );
}