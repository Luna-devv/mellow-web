import { getUser } from "./api";

interface Props {
    params: { userId: string };
}

export const revalidate = 60 * 60;

export default async function Home({
    params
}: Props) {
    const user = await getUser(params.userId);

    return (
        <>
            <i>User has no bio yet</i>
        </>
    );
}