import { ApiError } from "@/typings";

interface Props {
    key: string;
    body: unknown;
    onSuccess: () => void;
    onError: (err: string) => void;
}

export async function request(url: string, {
    key,
    body,

    onSuccess,
    onError
}: Props) {
    const res = await fetch([process.env.NEXT_PUBLIC_API, url].join(""), {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(key.includes(".") ?
            { [key.split(".")[0]]: { [key.split(".")[1]]: body } }
            :
            { [key]: body }
        )
    })
        .catch(() => null);

    if (res?.ok) {
        onSuccess();
        return;
    }


    const response = await res?.json()
        .catch(() => null);

    onError((response as unknown as ApiError | null)?.message || "unknown server error");
}