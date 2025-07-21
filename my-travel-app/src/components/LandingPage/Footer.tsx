import { MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-[rgba(255,255,255,1)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded flex items-center justify-center">
              <MapPin className="h-4 w-4 text-[rgba(255,255,255,1)]" />
            </div>

            <span className="font-medium text-[rgba(2,48,71,1)]">atlasAI</span>
          </div>

          <p className="text-xs text-[rgba(2,48,71,0.6)] sm:ml-4">© 2024 atlasAI. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-[rgba(2,48,71,0.6)] hover:text-[rgba(0,191,255,1)]" href="#">
              Terms of Service
            </Link>

            <Link className="text-xs hover:underline underline-offset-4 text-[rgba(2,48,71,0.6)] hover:text-[rgba(0,191,255,1)]" href="#">
              Privacy Policy
            </Link>
            
            <Link className="text-xs hover:underline underline-offset-4 text-[rgba(2,48,71,0.6)] hover:text-[rgba(0,191,255,1)]" href="#">
              Contact
            </Link>
          </nav>
        </footer>
    )
}