import Image from "next/image";
import Link from "next/link";

import StarIcon from "@/components/icons/star";
import { defaultFetchOptions } from "@/lib/api";

export interface Review {
    author: {
        id: string;
        username: string;
        avatar_url: string;
    };
    content: string;
    helpful: number;
    rating: "positive" | "negative";
}

export default async function Ratings() {
    const reviews = await fetch(`${process.env.RATINGS_API}/?id=${process.env.CLIENT_ID}`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => []) as Review[];

    const cumulativeStars = reviews?.reduce((acc, review) => acc + (review.rating === "positive" ? 5 : 1), 0);
    const averageStars = Math.floor(cumulativeStars / reviews.length) || 0;

    return (
        <Link
            aria-label="Reviews on Wumpus.store"
            className="flex gap-2 items-center"
            href={`https://wumpus.store/bot/${process.env.CLIENT_ID}#reviews`}
            target="_blank"
            title={`Ratet ${averageStars}/5 with ${reviews.length} reviews on Wumpus.store`}
        >
            <div className="flex gap-1">
                {averageStars ?
                    <div className="flex gap-1">
                        {new Array(averageStars).fill(0).map((_, i) =>
                            <StarIcon key={i} className="w-6 h-6 stroke-violet-500 fill-violet-400/20" />
                        )}
                    </div>
                    :
                    <></>
                }
                {5 - averageStars ?
                    <div className="flex gap-1">
                        {new Array(Math.max(5 - averageStars, 0)).fill(0).map((_, i) =>
                            <StarIcon key={i} className="w-6 h-6 stroke-violet-500 fill-transparent opacity-40" />
                        )}
                    </div>
                    :
                    <></>
                }
            </div>
            <span className="opacity-75 flex">
                on
                <Image
                    alt="Wumpus.store"
                    className="ml-1.5"
                    height={24}
                    src="https://cdn.discordapp.com/emojis/1184215185964146728.webp?size=96&quality=lossless"
                    width={24}
                />
                .store
            </span>
        </Link>
    );

}