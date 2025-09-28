import { Footer } from "@/components/footer";
import { Suspense } from "react";

export const revalidate = 43_200;

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full">
            {children}

            <Suspense>
                <Footer />
            </Suspense>
        </div>
    );
}