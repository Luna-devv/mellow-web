import { PronounsResponse } from "@/typings";

import List from "../list.component";

export default async function Home() {
    const sexualities = await fetch("https://prns-api.waya.one/sexualities", { next: { revalidate: 60 * 60 } }).then((res) => res.json()) as PronounsResponse;

    return <List res={sexualities} type="Sexualities" />;
}