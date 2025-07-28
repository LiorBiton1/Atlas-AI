"use client";
import { usePathname } from "next/navigation";
import { SidePanel } from "../ui/SidePanel";
import { TopPanel } from "../ui/TopPanel";

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();

    // Hide side panel on landing and auth pages
    const hideSidePanel = pathname === "/" || pathname.startsWith("/auth");

    if(hideSidePanel) {
        return <>{children}</>;
    }

    return (
        <div>
            <TopPanel />
            <div style={{ display: "flex" }}>
                <SidePanel />
                <main style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}