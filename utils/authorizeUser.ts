import React from "react";

import { User } from "@/common/user";
import { RouteErrorResponse } from "@/typings";

interface Props {
    stateHook: React.Dispatch<React.SetStateAction<"LOADING" | "ERRORED" | undefined>>;
    page: string;
}

export default async function authorize({ stateHook, page }: Props): Promise<User | null> {
    stateHook(undefined);
    let res: null | User = null;

    let serverError = false;
    if (localStorage.getItem("token")) {

        stateHook("LOADING");
        res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") as string
            }
        })
            .then((res) => res.json())
            .catch((res) => {
                if (res?.status?.toString() !== "401" && res?.status?.toString() !== "200") {
                    serverError = true;
                    stateHook("ERRORED");
                }
                return null;
            });

        if (res && (res as unknown as RouteErrorResponse)?.statusCode?.toString() !== "401" && (res as unknown as RouteErrorResponse).statusCode?.toString() !== "200") {
            stateHook("ERRORED");
            serverError = true;
        }

        if (res && !res?.id && !serverError && page !== "/logout" && page !== "/login") {
            window.location.href = `${process.env.NEXT_PUBLIC_LOGIN}&scope=identify+email+guilds${localStorage.getItem("freshleyLoggedout") === "true" ? "" : "&prompt=none"}`;
            return null;
        }

    }

    if (!res && (page.startsWith("/dashboard") || page.startsWith("/profile"))) {
        window.location.href = `${process.env.NEXT_PUBLIC_LOGIN}&scope=identify+email+guilds${localStorage.getItem("freshleyLoggedout") === "true" ? "" : "&prompt=none"}`;
        return null;
    }

    if (res) stateHook(undefined);
    return res || null;
}