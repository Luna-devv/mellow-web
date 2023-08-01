export const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
};

export const getCanonicalUrl = (...pages: string[]) => {
    return `${getBaseUrl()}/${pages.join("/")}`;
};