"use client";
import Link from "next/link";
import { type HTMLProps, useState } from "react";
import { HiArrowDown, HiArrowUp, HiLightningBolt, HiOutlineInformationCircle } from "react-icons/hi";

import { userStore } from "@/common/user";
import { Button } from "@/components/ui/button";
import { InputBase, InputBaseAdornment, InputBaseAdornmentButton, InputBaseControl, InputBaseInput } from "@/components/ui/input-base";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
                    prefetch={false}
                    href="/profile/billing"
                >
                    <HiLightningBolt />
                    Manage Subscription
                </Link>
            </Button>
        );
    }

    return (
        <div className="w-full flex gap-4">
            <DonationSelect
                className="w-56"
                donation={donation}
                setDonation={setDonation}
            />

            <Button
                asChild
                variant="secondary"
            >
                <Link
                    className="w-full"
                    prefetch={false}
                    href={`/premium/checkout?donation=${donation}`}
                >
                    <HiLightningBolt />
                    Subscribe
                </Link>
            </Button>
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
                <div className="relative right-1 flex gap-1">
                    <Button
                        className="h-7"
                        size="icon"
                        onClick={() => setDonation(Math.min(donation + 1, 100))}
                        disabled={donation >= 100}
                    >
                        <HiArrowUp className="!size-3" />
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
                $
            </InputBaseAdornment>
            <InputBaseControl>
                <InputBaseInput
                    placeholder="extra donation"
                    defaultValue={0}
                    onChange={(e) => {
                        const num = Number(e.target.value);
                        if (isNaN(num)) return;

                        setDonation(Math.max(Math.min(num, 100), 0));
                    }}
                    value={donation}
                />
            </InputBaseControl>
            <Tooltip delayDuration={0}>
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