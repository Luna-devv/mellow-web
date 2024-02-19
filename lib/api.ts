export const cacheOptions = {
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false
};

export async function getData<T>(path: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}${path}`, {
        headers: {
            authorization: localStorage.getItem("token") as string
        }
    });

    return response.json() as Promise<T>;
}