import ImageReduceMotion from "@/components/image-reduce-motion";
import { Image } from "@nextui-org/react";
import { getUser } from "./api";
import paintPic from "@/public/paint.webp";
import Side from "./side.component";

interface Props {
    params: { userId: string };
    children: React.ReactNode;
}

export default async function RootLayout({
    params,
    children
}: Props) {
    const user = await getUser(params.userId);

    const userExists = user && "id" in user;

    return (
        <div className="w-full">

            <div className="relative mb-16 w-full">
                <Image
                    alt=""
                    className="w-full object-cover"
                    classNames={{ img: "h-36 md:h-64", blurredImg: "h-40 md:h-72 -top-5" }}
                    isBlurred
                    src={userExists && user.bannerUrl ? user.bannerUrl : paintPic.src}
                    width={3840 / 2}
                    height={2160 / 2}
                />

                <div
                    className="text-lg flex gap-5 items-center absolute top-[100px] md:top-[203px] left-[12px] md:left-8 py-4 px-5 rounded-3xl z-20 backdrop-blur-3xl backdrop-brightness-75 shadow-md"
                >
                    <ImageReduceMotion
                        alt="Server icon"
                        className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40"
                        url={userExists ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : "/discord"}
                        size={128}
                    />

                    <div className="flex flex-col gap-1">
                        <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium max-w-md truncate">
                            {userExists ? (user.globalName || user.username) : "Unknown User"}
                        </div>
                        <div className="text-sm font-semibold flex items-center gap-1">
                            @{userExists ? user.username : "Unknown User"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:flex">

                <div className="lg:w-3/4 md:w-2/3 w-full md:mr-6" >
                    {children}
                </div>

                <div className="lg:w-1/4 md:w-1/3 mt-8 md:mt-0">
                    <Side
                        user={user}
                    />
                </div>

            </div>

        </div >
    );
}