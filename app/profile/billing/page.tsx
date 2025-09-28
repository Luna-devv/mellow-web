"use client";

import { DonationSelect } from "@/app/(home)/premium/subscribe.component";
import { userStore } from "@/common/user";
import Box from "@/components/box";
import ImageReduceMotion from "@/components/image-reduce-motion";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import InputSwitch from "@/components/inputs/switch";
import Modal from "@/components/modal";
import Notice from "@/components/notice";
import { OverviewLink } from "@/components/overview-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { type ApiEdit, useApi } from "@/lib/api/hook";
import type { ApiV1UsersMeBillingGetResponse, ApiV1UsersMeGuildsGetResponse } from "@/typings";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useRef, useState } from "react";
import { GrAmex } from "react-icons/gr";
import { HiCreditCard, HiLightningBolt } from "react-icons/hi";
import { SiDinersclub, SiDiscover, SiJcb, SiMastercard, SiStripe, SiVisa } from "react-icons/si";

function isActive(status: ApiV1UsersMeBillingGetResponse["status"]): status is "active" | "trialing" | "past_due" {
    return status === "active" || status === "trialing" || status === "past_due";
}

export default function Home() {
    const user = userStore((u) => u);
    const [changeDonationModalOpen, setChangeDonationModalOpen] = useState(false);

    const { data, isLoading, error, edit } = useApi<ApiV1UsersMeBillingGetResponse>("/users/@me/billing");

    if ((isLoading && !user?.premium) || (!isLoading && !data) || (data && !isActive(data.status))) {
        return (<>
            {(error && error !== "Not Found") && <Notice message={error} />}

            <OverviewLink
                title="Upgrade to Premium"
                message="Get access to premium features, higher limits, and more — such as supporting the project!"
                url="/premium"
                icon={<HiLightningBolt />}
            />

            {data?.status && (
                <Button asChild>
                    <Link
                        href={data?.portalUrl}
                        target="_blank"
                    >
                        Billing Portal
                    </Link>
                </Button>
            )}
        </>);
    }

    const periodEndsInDays = Math.floor((((data?.currentPeriodEnd || 0) - Date.now() / 1_000) / (60 * 60 * 24)));
    const periodEndsInStr = `${periodEndsInDays > 1 ? "in " : ""}${periodEndsInDays === 0 ? "Today" : periodEndsInDays === 1 ? "Tomorrow" : periodEndsInDays} ${periodEndsInDays > 1 ? "days" : ""}`;

    return (
        <div className="space-y-2">
            {data?.status === "past_due" && (
                <Notice message={`Your renew is over due! Please check your emails to renew your subscription or contact support. Your subscription will be canceled ${periodEndsInStr}.`} />
            )}

            <Box
                className="md:flex justify-between"
                small
            >
                <div className="flex flex-col">
                    <h2 className="font-bold text-3xl bg-gradient-to-r bg-clip-text text-transparent from-violet-400/80 to-indigo-400/80">
                        Wamellow Premium
                        {data?.status === "trialing" && (
                            <Badge
                                className="relative bottom-1 ml-2"
                            >
                                trial — Ends {periodEndsInStr}
                            </Badge>
                        )}
                    </h2>
                    <p className="text-muted-foreground">You have all premium features for <span className="font-semibold text-neutral-300">EUR {(4 + (data?.donationQuantity || 0)).toFixed(2)} / {data?.priceId.startsWith("monthly_") ? "Month" : "Year"}</span>!</p>
                </div>
                <div className="flex gap-1 mt-4 md:mt-0">
                    {isLoading
                        ? <Skeleton className="h-10 w-full md:w-20" />
                        : <PortalButton data={data!} />
                    }
                </div>
            </Box>

            <div className="flex-col lg:flex-row flex gap-4 pt-1">
                <Box
                    className="lg:w-1/2 text-sm"
                    small
                >
                    <h2 className="font-semibold text-xl text-neutral-300 mb-2 lg:mb-0 lg:relative lg:bottom-2">Billing Cycle</h2>
                    {isLoading
                        ? <Skeleton className="h-12 w-full" />
                        : (data?.cancelAtPeriodEnd
                            ? <p>
                                Your subscription will expire on <span className="font-semibold text-neutral-300">{new Date(data.currentPeriodEnd * 1_000).toLocaleDateString()}</span> and you will not be charged again.
                            </p>
                            : <p>
                                Your subscription will renew on <span className="font-semibold text-neutral-300">{new Date(data!.currentPeriodEnd * 1_000).toLocaleDateString()}</span>, for a total of <span className="font-semibold text-neutral-300">EUR {(4 + (data!.donationQuantity || 0)).toFixed(2)}</span>.

                                You{"'"}re paying <span className="font-semibold text-neutral-300">EUR {(4).toFixed(2)} Premium</span> and <span className="font-semibold text-neutral-300">EUR {(data!.donationQuantity || 0).toFixed(2)} Donation{data!.donationQuantity ? "s" : ""}</span>
                                {" "}
                                (<Button
                                    className="text-sm p-0 m-0 h-3 text-violet-400"
                                    onClick={() => setChangeDonationModalOpen(true)}
                                    variant="link"
                                    size="sm"
                                >
                                    change
                                </Button>).
                            </p>
                        )
                    }
                </Box>
                <Box
                    className="lg:w-1/2"
                    small
                >
                    <h2 className="font-semibold text-xl text-neutral-300 mb-2 lg:mb-0  lg:relative lg:bottom-2">Payment Method</h2>
                    {isLoading
                        ? <Skeleton className="h-12 w-full" />
                        :
                        <div className="flex gap-2 items-center bg-wamellow-100 px-4 py-1 rounded-lg">
                            <PaymentMethodIcon method={data!.paymentMethod} />
                            {typeof data?.paymentMethod === "string" ? data?.paymentMethod : "**** **** **** " + data?.paymentMethod?.last4}
                            <Button
                                asChild
                                className="ml-auto"
                                variant="link"
                            >
                                <Link href={data!.portalUrl}>
                                    Change
                                </Link>
                            </Button>
                        </div>
                    }
                </Box>
            </div>

            <div className="pt-4">
                <PremiumGuildSelect
                    isParentLoading={isLoading}
                    guildIds={data?.guildIds || []}
                />
            </div>

            {data && (
                <ChangeDonationAmountModal
                    open={changeDonationModalOpen}
                    setOpen={setChangeDonationModalOpen}
                    donationQuantity={data?.donationQuantity || 0}
                    trialing={data.status === "trialing"}
                    edit={edit}
                />
            )}
        </div>
    );
}

function PortalButton({ data }: { data: ApiV1UsersMeBillingGetResponse; }) {
    const path = getPortalPath(data);

    return (
        <Button
            asChild
            className="w-full md:w-auto"
        >
            <Link href={data.portalUrl + "/" + path}>
                {path?.split("/").pop()?.replace(/^\w/, (char) => char.toUpperCase()) || "Manage"}
            </Link>
        </Button>
    );
}

function getPortalPath(data: ApiV1UsersMeBillingGetResponse) {
    if (data.cancelAtPeriodEnd) return "subscriptions/" + data.subscriptionId + "/reactivate";
    return "subscriptions/" + data.subscriptionId + "/cancel";
}

function PaymentMethodIcon({ method }: { method: ApiV1UsersMeBillingGetResponse["paymentMethod"]; }) {
    if (typeof method === "string") {
        return <HiCreditCard className="size-6" />;
    }

    switch (method?.brand) {
        case "amex": return <GrAmex className="size-6" />;
        case "diners": return <SiDinersclub className="size-6" />;
        case "discover": return <SiDiscover className="size-6" />;
        case "jcb": return <SiJcb className="size-6" />;
        case "link": return <SiStripe className="size-6" />;
        case "mastercard": return <SiMastercard className="size-6" />;
        case "visa": return <SiVisa className="size-6"/>;
    }

    return <HiCreditCard className="size-6" />;
}

function PremiumGuildSelect({
    isParentLoading,
    guildIds
}: {
    isParentLoading: boolean;
    guildIds: string[];
}) {
    const { isLoading, data, error } = useApi<ApiV1UsersMeGuildsGetResponse[]>("/users/@me/guilds");

    if (isLoading || isParentLoading) {
        return (
            <div className="w-full md:w-1/3 flex flex-col">
                <Skeleton className="w-32 h-5 rounded-lg mt-1.5" />
                <Skeleton className="w-full h-12 mt-1.5" />
                <Skeleton className="w-96 h-5 rounded-lg mt-1.5" />
            </div>
        );
    }

    if (error) {
        return <Notice message={error} />;
    }

    return (
        <MultiSelectMenu
            className="w-full md:w-1/2 lg:w-1/3"
            name="Premium Guilds"
            url="/users/@me/billing/premium-guilds"
            dataName="guildIds"
            items={(data || [])
                .filter((guild) => guild.bot)
                .map((guild) => ({
                    icon: (
                        <ImageReduceMotion
                            alt={guild.name}
                            className="rounded-md size-6 relative right-2"
                            url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                            size={32}
                        />
                    ),
                    name: guild.name,
                    value: guild.id
                }))
            }
            description="Select guilds where you want to enable premium features."
            defaultState={guildIds}
        />
    );
}

function ChangeDonationAmountModal({
    open,
    setOpen,
    donationQuantity: defaultDonationQuantity,
    trialing,
    edit
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    donationQuantity: number;
    trialing: boolean;
    edit: ApiEdit<ApiV1UsersMeBillingGetResponse>;
}) {
    const [donation, setDonation] = useState(defaultDonationQuantity);
    const [terms, setTerms] = useState(false);
    const captcha = useRef<TurnstileInstance>(null);

    const dueToday = donation - defaultDonationQuantity;

    return (
        <Modal
            title="Change Donation Amount"
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/billing`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        captcha: captcha.current!.getResponse()!
                    },
                    body: JSON.stringify({
                        donationQuantity: donation,
                        terms
                    })
                });
            }}
            onSuccess={() => {
                edit("donationQuantity", donation);
            }}
            onError={() => {
                captcha.current?.reset();
            }}
            isDisabled={donation === defaultDonationQuantity || !terms}
        >
            <p className="text-sm mb-4">
                Change how much you want to donate on top of the monthly premium subscription.
                Please do not feel pressured to donate more than you can afford.
                I appreciate any additional support you can provide 💜
            </p>

            <DonationSelect
                className="w-full"
                donation={donation}
                setDonation={setDonation}
            />

            <p className="text-sm mt-8 mb-6">
                <Separator className="my-4" />

                {dueToday > 0 && (
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-medium text-neutral-100">Due Today</h2>
                            <p className="text-sm text-neutral-500">
                                {trialing
                                    ? "Due to your active trial, you will not be charged today."
                                    : "You will receive an invoice via email."
                                }
                            </p>
                        </div>

                        <span className="text-xl font-medium text-neutral-100">€{trialing ? 0 : dueToday.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium text-neutral-100">Monthly Total</h2>
                        <p className="text-sm text-neutral-500">The total amount you will be charged monthly.</p>
                    </div>

                    <span className="text-xl font-medium text-neutral-100">€{(donation + 4).toFixed(2)}</span>
                </div>
            </p>

            <Separator className="my-4" />

            <InputSwitch
                label="I agree to the terms and conditions"
                description="I waive my right of withdrawal."
                link="/terms"
                defaultState={terms}
                onSave={setTerms}
                isTickbox
            />

            <Turnstile
                className="mt-10"
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_KEY!}
                options={{
                    size: "flexible",
                    theme: "dark"
                }}
                ref={captcha}
            />
        </Modal>
    );
}