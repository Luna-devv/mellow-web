"use client";

import type { User } from "@/common/user";
import { userStore } from "@/common/user";
import { webStore } from "@/common/webstore";
import { LoginButton } from "@/components/login-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { authorize } from "@/utils/authorize-user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiBookOpen, HiChevronDown, HiIdentification, HiLogout, HiSparkles, HiSupport, HiTerminal, HiViewGridAdd } from "react-icons/hi";

import { Skeleton } from "./ui/skeleton";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

export function Header() {
    const [state, setState] = useState<State>(State.Loading);
    const user = userStore((s) => s);

    useEffect(() => {
        authorize({ setState })
            .then((_user) => {
                userStore.setState({
                    ...(_user || {}),
                    __fetched: true
                });
            });

        webStore.setState({
            width: window?.innerWidth
        });
    }, []);

    if (state === State.Failure) {
        return <LoginButton state={state} className="ml-auto" />;
    }

    if (state === State.Loading || !user) {
        return (
            <div className="ml-auto flex items-center py-2 px-4">
                <Skeleton className="rounded-full mr-2 size-[30px]" />
                <Skeleton className="rounded-xl w-20 h-5" />
            </div>
        );
    }

    return <Dropdown user={user} />;
}

function Dropdown({ user }: { user: User; }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="ml-auto truncate flex hover:bg-wamellow py-2 px-4 rounded-lg duration-200 items-center data-[state=open]:bg-wamellow outline-none"
                >
                    <Avatar className="size-[30px] mr-2">
                        <AvatarImage
                            alt={user.username}
                            src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=96` : "/discord.webp"}
                        />
                    </Avatar>

                    <p className="mr-1 relative bottom-px truncate block text-primary-foreground font-medium tracking-tight">{user.globalName || user.username}</p>
                    <HiChevronDown />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 scale-120 relative top-7 right-5' align="end">
                <DropdownMenuLabel className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage
                            alt={user.username}
                            src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=96` : "/discord.webp"}
                        />
                    </Avatar>
                    <div className='flex flex-col pb-0.5 truncate'>
                        <span className='text-popover-foreground truncate'>{user.globalName || user.username}</span>
                        <span className='text-muted-foreground text-xs truncate'>{user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <HiViewGridAdd />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <HiIdentification />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={user.premium ? "/profile/billing" : "/premium"}>
                            <HiSparkles />
                            {user.premium ? "Billing" : "Premium"}
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/support">
                            <HiSupport />
                            Support
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/docs/index">
                            <HiBookOpen />
                            Documentation
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <HiTerminal />
                        Developer API
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        asChild
                        className="text-red-400"
                    >
                        <Link href="/login?logout=true" prefetch={false}>
                            <HiLogout />
                            Logout
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}