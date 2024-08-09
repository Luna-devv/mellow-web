import { Footer } from "@/components/footer";

export const revalidate = 43200;

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full">
            {children}

            <Footer />
        </div>
    );
}