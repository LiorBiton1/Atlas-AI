import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function Header() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-[rgba(255,255,255,0.95)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,255,0.6)] sticky top-0 z-50">  
            <Link className="flex items-center justify-center" href="#">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-[rgba(255,255,255,1)]" />
                    </div>
                    <span className="font-bold text-xl text-[rgba(2,48,71,1)]">atlasAI</span>
                </div>
            </Link>

            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:text-[rgba(0,191,255,1)] transition-colors text-[rgba(2,48,71,1)]" href="#features">
                    Features
                </Link>

                <Link className="text-sm font-medium hover:text-[rgba(0,191,255,1)] transition-colors text-[rgba(2,48,71,1)]" href="#how-it-works">
                    How it Works
                </Link>

                <Link className="text-sm font-medium hover:text-[rgba(0,191,255,1)] transition-colors text-[rgba(2,48,71,1)]" href="#pricing">
                    Pricing
                </Link>
            </nav>

            <div className="ml-4 flex gap-2">
                <Button variant="ghost" size="sm" className="hover:text-[rgba(0,191,255,1)] text-[rgba(2,48,71,1)]">
                    Sign In
                </Button>

                <Button size="sm" className="bg-gradient-to-r from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] hover:from-[rgba(0,191,255,0.9)] hover:to-[rgba(64,224,208,0.9)]">
                    Get Started
                </Button>
            </div>
        </header>
    )
}