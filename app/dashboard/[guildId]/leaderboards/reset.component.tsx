import { Button } from "@nextui-org/react";
import { useState } from "react";
import { HiTrash, HiUsers } from "react-icons/hi";

import { Guild } from "@/common/guilds";
import ImageReduceMotion from "@/components/image-reduce-motion";
import Modal from "@/components/modal";
import Notice, { NoticeType } from "@/components/notice";
import { intl } from "@/utils/numbers";

interface Props {
    guild: Guild;
}

enum ModalType {
    Delete = 1,
}

export default function ResetLeaderboard({ guild }: Props) {

    const [modal, setModal] = useState<ModalType>();

    return (
        <>
            <Button
                onClick={() => setModal(ModalType.Delete)}
                color="danger"
                variant="flat"
                startContent={<HiTrash />}
            >
                Reset Leaderboard
            </Button>

            <Modal
                title="Reset @everyone's stats"
                buttonName="Reset"
                variant="danger"
                isOpen={modal === ModalType.Delete}
                onClose={() => setModal(undefined)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild.id}/top-members`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                }}
            >
                <Notice
                    type={NoticeType.Info}
                    message="Takes a few seconds to apply"
                />

                <div className="flex items-center gap-3">
                    <ImageReduceMotion
                        alt="Guild Icon"
                        className="rounded-full"
                        url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                        size={56}
                    />

                    <div className="flex flex-col gap-1">
                        <div className="text-xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                        <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
                    </div>
                </div>

            </Modal>
        </>
    );
}