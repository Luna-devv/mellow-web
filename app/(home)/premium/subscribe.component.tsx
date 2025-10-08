"use client";
import { userStore } from "@/common/user";
import { Button } from "@/components/ui/button";
import { InputBase, InputBaseAdornment, InputBaseAdornmentButton, InputBaseControl, InputBaseInput } from "@/components/ui/input-base";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { type HTMLProps, useState } from "react";
import { HiArrowDown, HiArrowUp, HiLightningBolt, HiOutlineInformationCircle } from "react-icons/hi";

export function Subscribe() {
    const premium = userStore((u) => u?.premium || false);
    const [donation, setDonation] = useState(0);

    if (premium) {
        return (
            <Button
                asChild
                variant="secondary"
            >
                <Link
                    className="w-full"
                    href="/profile/billing"
                >
                    <HiLightningBolt />
                    Manage Subscription
                </Link>
            </Button>
        );
    }

    return (
        <div className="w-full">
            <div className="w-full relative overflow-hidden rounded-lg border border-border group p-px h-fit">
                <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_0%_50%,#8b5cf6_50%,hsl(var(--input)/30)_7%)]" />
                <Button
                    asChild
                    className='w-full px-2 backdrop-blur-sm backdrop-brightness-50 md:backdrop-brightness-[25%] bg-none rounded-[6px] hover:bg-[#8b5cf6]/50'
                >
                    <Link
                        prefetch={false}
                        href={`/premium/checkout?donation=${donation}`}
                    >
                        <HiLightningBolt />
                        Subscribe
                    </Link>
                </Button>
            </div>

            <div className="relative w-full gap-2 h-3">
                <Separator className="w-full mt-4" />
                <span className="absolute bg-[#0d0d0d] px-2 -top-1.5 left-1/2 -translate-x-1/2 text-muted-foreground font-medium text-xs uppercase">choose what to pay</span>
            </div>

            <div className="flex gap-1 w-full mt-2">
                {[4, 8, 12, 18, 25].map((amount) => (
                    <Button
                        key={amount}
                        className={cn("h-7 w-1/5", amount === (donation + 4) && "bg-violet-400/20 hover:bg-violet-400/40")}
                        onClick={() => setDonation(amount - 4)}
                    >
                        {amount}€
                    </Button>
                ))}
            </div>
        </div>
    );
}

interface DonationProps extends HTMLProps<HTMLDivElement> {
    donation: number;
    setDonation: (value: number) => void;
}

export function DonationSelect({ donation, setDonation, ...props }: DonationProps) {
    return (
        <InputBase {...props}>
            <InputBaseAdornment className="flex">
                <div className="relative right-1.5 flex gap-1">
                    <Button
                        className={cn("h-7", donation === 0 && "animate-bounce transition-all duration-800")}
                        size="icon"
                        onClick={() => setDonation(Math.min(donation + 1, 100))}
                        disabled={donation >= 100}
                    >
                        <HiArrowUp className="!size-3 " />
                    </Button>
                    <Button
                        className="h-7"
                        size="icon"
                        onClick={() => setDonation(Math.max(donation - 1, 0))}
                        disabled={donation <= 0}
                    >
                        <HiArrowDown className="!size-3" />
                    </Button>
                </div>
                €
            </InputBaseAdornment>
            <InputBaseControl>
                <InputBaseInput
                    placeholder="extra donation"
                    defaultValue={0}
                    onChange={(e) => {
                        const num = Number(e.target.value);
                        if (Number.isNaN(num)) return;

                        setDonation(Math.max(Math.min(num, 100), 0));
                    }}
                    value={donation}
                />
            </InputBaseControl>
            <Tooltip>
                <InputBaseAdornment>
                    <InputBaseAdornmentButton asChild>
                        <TooltipTrigger>
                            <HiOutlineInformationCircle />
                        </TooltipTrigger>
                    </InputBaseAdornmentButton>
                </InputBaseAdornment>
                <TooltipContent>
                    <p>Extra donation</p>
                </TooltipContent>
            </Tooltip>
        </InputBase>
    );
}