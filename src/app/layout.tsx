import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MiniVouch — Testimonials That Matter",
    description: "Collect and showcase genuine testimonials. Real feedback from real people.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: "#818cf8",
                    colorBackground: "#111827",
                    colorInputBackground: "#1f2937",
                    colorText: "#f1f5f9",
                },
            }}
        >
            <html lang="en">
                <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <ThemeProvider>
                        <Navbar />
                        <div style={{ flex: 1 }}>{children}</div>
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
