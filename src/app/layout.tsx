import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import ProviderWrapper from "@/app/ProviderWrapper";


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "SpeechBreeze",
    description: "Lightning LSA's",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body>
                <ProviderWrapper>
                    {children}
                </ProviderWrapper>
            </body>
        </html>
    );
}
