"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowNarrowLeft, HiExternalLink, HiFingerPrint } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import SelectInput from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import Notice from "@/components/notice";
import { OverviewLink } from "@/components/overview-link";
import type { ApiError, ApiV1GuildsModulesPassportGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { getCanonicalUrl } from "@/utils/urls";

import CompleteSetup from "./complete-setup";

export default function Home() {
    const guild = guildStore((g) => g);

    const [error, setError] = useState<string>();
    const [passport, setPassport] = useState<ApiV1GuildsModulesPassportGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/passport`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesPassportGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setPassport(response);
                        break;
                    }
                    default: {
                        setPassport(undefined);
                        setError((response as unknown as ApiError).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching passport data");
            });

    }, []);

    if (passport === undefined) return (
        <div>
            <Link href={`/dashboard/${guild?.id}/greeting`} className="button-underline relative bottom-3 mb-4">
                <HiArrowNarrowLeft /> Greetings
            </Link>
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                as={Link}
                href={`/dashboard/${guild?.id}/greeting`}
                startContent={<HiArrowLeft />}
                size="sm"
            >
                Back
            </Button>
            <Button
                as={Link}
                href="/docs/passport"
                target="_blank"
                endContent={<HiExternalLink />}
                size="sm"
            >
                Read docs
            </Button>
        </div>

        {passport.enabled && passport.punishment === 2 && !passport.punishmentRoleId &&
            <Notice message="A punishment role must be set when using 'Assign role to member'." />
        }

        {passport.enabled && !passport.successRoleId &&
            <Notice message="A verified role must be set for passport to work." />
        }

        <CompleteSetup
            guild={guild}
            passport={passport}
            setPassport={setPassport}
        />

        <Switch
            label="Passport module enabled"
            endpoint={`/guilds/${guild?.id}/modules/passport`}
            k="enabled"
            defaultState={passport?.enabled}
            disabled={false}
            onSave={(s) => {
                setPassport({
                    ...passport,
                    enabled: s
                });
            }}
        />

        <Switch
            label="Send direct message to member on fail"
            endpoint={`/guilds/${guild?.id}/modules/passport`}
            k="sendFailedDm"
            defaultState={passport?.sendFailedDm}
            disabled={!passport.enabled}
        />

        <SelectInput
            name="Logging channel"
            url={`/guilds/${guild?.id}/modules/passport`}
            dataName="channelId"
            items={createSelectableItems(guild?.channels)}
            description="Select the channel where verification logs should be send into."
            defaultState={passport?.channelId}
            disabled={!passport.enabled}
        />

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <SelectInput
                    name="Unverified role"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="unverifiedRoleId"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select what role members should get when joining."
                    defaultState={passport?.unverifiedRoleId}
                    showClear
                    disabled={!passport.enabled}
                />
            </div>

            <div className="lg:w-1/2">
                <SelectInput
                    name="Verified role"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="successRoleId"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select what role members should get when completing verification."
                    defaultState={passport?.successRoleId}
                    disabled={!passport.enabled}
                />
            </div>
        </div>

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <SelectInput
                    name="Failed verification action"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="punishment"
                    items={[
                        { name: "Ban member", value: 0 },
                        { name: "Kick member", value: 1 },
                        { name: "Assign role to member", value: 2 }
                    ]}
                    description="Choose what should happen if a member failes verification."
                    defaultState={passport?.punishment}
                    disabled={!passport.enabled}
                    onSave={(o) => {
                        setPassport({
                            ...passport,
                            punishment: o.value as ApiV1GuildsModulesPassportGetResponse["punishment"]
                        });
                    }}
                />
            </div>

            <div className="lg:w-1/2">
                <SelectInput
                    name="Punishment role"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="punishmentRoleId"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select what role members should get when failing verification."
                    defaultState={passport?.punishmentRoleId}
                    disabled={!passport.enabled || passport.punishment !== 2}
                    onSave={(o) => {
                        setPassport({
                            ...passport,
                            punishment: o.value as ApiV1GuildsModulesPassportGetResponse["punishment"]
                        });
                    }}
                />
            </div>
        </div>

        <OverviewLink
            className="mt-8"
            title="View Passport"
            message="Easily verify your members with a simple and secure CAPTCHA in the web."
            url={`/passport/${params.guildId}`}
            icon={<HiFingerPrint />}
        />

        <div className="w-fit">
            <CopyToClipboardButton title="Copy link to passport" text={getCanonicalUrl("passport", guild?.id as string)} />
        </div>

    </>);
}