import React, { useEffect, useState } from "react";

import { Guild } from "@/common/guilds";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { ApiV1GuildsModulesPassportGetResponse } from "@/typings";

enum ModalType {
    None = 0,
    VerifiedRole = 1,
    PunishmentRole = 2,
}

interface Props {
    guild: Guild | undefined;
    passport: ApiV1GuildsModulesPassportGetResponse;
    setPassport: React.Dispatch<React.SetStateAction<ApiV1GuildsModulesPassportGetResponse | undefined>>;
}

export default function CompleteSetup({
    guild,
    passport,
    setPassport
}: Props) {

    const [modal, setModal] = useState<ModalType>(ModalType.None);

    const [roleId, setRoleId] = useState<string>();

    useEffect(() => {
        if (!passport?.enabled) return;

        if (!passport.successRoleId) {
            setModal(ModalType.VerifiedRole);
            return;
        }

        if (passport.punishment === 2 && !passport.punishmentRoleId) {
            setModal(ModalType.PunishmentRole);
            return;
        }
    }, [passport]);

    return (
        <>
            <Modal
                title="Verified role"
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
                onSuccess={() => {
                    setPassport({
                        ...passport,
                        successRoleId: roleId
                    });
                }}
            >
                <SelectMenu
                    name="Role"
                    items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }))}
                    description="Select what role members should get when completing verification."
                    defaultState={passport.punishmentRoleId}
                    onSave={(o) => {
                        setRoleId(o.value as string);
                    }}
                />
            </Modal>

            <Modal
                title="Punishment role"
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
                onSuccess={() => {
                    setPassport({
                        ...passport,
                        punishmentRoleId: roleId
                    });
                }}
            >
                <SelectMenu
                    name="Role"
                    items={guild?.roles?.sort((a, b) => b.position - a.position).map((r) => ({ name: `@${r.name}`, value: r.id, error: r.missingPermissions.join(", "), color: r.color }))}
                    description="Select what role members should get when failing verification."
                    defaultState={passport.punishmentRoleId}
                    onSave={(o) => {
                        setRoleId(o.value as string);
                    }}
                />
            </Modal>
        </>
    );

}