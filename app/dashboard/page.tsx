import { redirect } from "next/navigation";

interface Props {
    searchParams: Promise<Record<string, string>>;
}

export default async function Home({ searchParams }: Props) {
    redirect(`/profile?${objectToSearchParams(await searchParams)}`);
}

function objectToSearchParams(obj: Record<string, string>): string {
    if (!Object.keys(obj).length) return "";

    const params = new URLSearchParams();

    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (value !== null && value !== undefined) {
            params.append(key, value.toString());
        }
    }

    return params.toString();
}