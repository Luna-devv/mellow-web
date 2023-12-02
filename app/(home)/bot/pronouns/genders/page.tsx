import { PronounsResponse } from "@/typings";

import List from "../list.component";

export default async function Home() {
    const genders = await fetch("https://prns-api.waya.one/genders", { next: { revalidate: 60 * 60 } }).then((res) => res.json()) as PronounsResponse;

    return <List res={genders} type="Genders" />;
}