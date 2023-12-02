import { PronounsResponse } from "@/typings";

import List from "../list.component";

export default async function Home() {
    const pronouns = await fetch("https://prns-api.waya.one/pronouns", { next: { revalidate: 60 * 60 } }).then((res) => res.json()) as PronounsResponse;

    return <List res={pronouns} type="Pronouns" />;
}