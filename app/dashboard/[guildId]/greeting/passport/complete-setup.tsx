import { useEffect, useState } from "react";

import type { Guild } from "@/common/guilds";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import type { ApiEdit } from "@/lib/api/hook";
import type { ApiV1GuildsModulesPassportGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";

enum ModalType {
    None = 0,
    VerifiedRole = 1,
    PunishmentRole = 2
}

interface Props {
    guild: Guild | undefined;
    data: ApiV1GuildsModulesPassportGetResponse;
    edit: ApiEdit<ApiV1GuildsModulesPassportGetResponse>;
}

export default function CompleteSetup({
    guild,
    data,
    edit
}: Props) {
    const [modal, setModal] = useState<ModalType>(ModalType.None);

    const [roleId, setRoleId] = useState<string | null>(null);

    useEffect(() => {
        if (!data.enabled) return;

        if (!data.successRoleId) {
            setModal(ModalType.VerifiedRole);
            return;
        }

        if (data.punishment === 2 && !data.punishmentRoleId) {
            setModal(ModalType.PunishmentRole);
            return;
        }
    }, [data]);

    return (<>
        <Modal
            title="Verified role"
            className="!overflow-visible"
            isOpen={!!guild && modal === ModalType.VerifiedRole}
            onClose={() => setModal(ModalType.None)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/modules/passport`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        successRoleId: roleId
                    })
                });
            }}
            onSuccess={() => edit("successRoleId", roleId)}
        >
            <SelectMenu
                name="Role"
                items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                description="Select what role members should get when completing verification."
                defaultState={data.punishmentRoleId}
                onSave={(o) => setRoleId(o.value)}
            />
        </Modal>

        <Modal
            title="Punishment role"
            className="!overflow-visible"
            isOpen={!!guild && modal === ModalType.PunishmentRole}
            onClose={() => setModal(ModalType.None)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/modules/passport`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        punishmentRoleId: roleId
                    })
                });
            }}
            onSuccess={() => edit("punishmentRoleId", roleId)}
        >
            <SelectMenu
                name="Role"
                items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                description="Select what role members should get when failing verification."
                defaultState={data.punishmentRoleId}
                onSave={(o) => setRoleId(o.value)}
            />
        </Modal>
    </>);
}