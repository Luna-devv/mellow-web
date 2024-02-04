export async function getData<T>(path: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}${path}`, {
        headers: {
            authorization: localStorage.getItem("token") as string
        }
    });

    return response.json() as Promise<T>;
}