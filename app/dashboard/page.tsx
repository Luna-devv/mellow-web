import { redirect } from "next/navigation";

export default function Home({
    searchParams
}: {
    searchParams: Record<string, string>;
}) {
    redirect(`/profile?${objectToSearchParams(searchParams)}`);
}

function objectToSearchParams(obj: Record<string, string>): string {
    if (!Object.keys(obj).length) return "";

    const params = new URLSearchParams();

    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value !== null && value !== undefined) {
            params.append(key, value.toString());
        }
    });

    return params.toString();
}