import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function CTASection() {
    return (
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
            {/* Bright Beach Background */}
            <div className="absolute inset-0 z-0">
                <Image src="/infinity-pool-sunset.png" alt="Luxury infinity pool at sunset" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,104,104,0.85)] via-[rgba(255,209,102,0.7)] to-[rgba(0,191,255,0.8)]"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center text-[rgba(255,255,255,1)]">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl drop-shadow-lg">
                            Ready for paradise?
                        </h2>

                        <p className="max-w-[600px] text-[rgba(255,255,255,0.95)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow-md">
                            Join thousands of happy travelers who have found their perfect vacation with atlasAI.
                        </p>
                    </div>
                    <div className="w-full max-w-[500px] space-y-2 mx-auto flex flex-col items-center">
                        <Button type="submit" className="bg-gradient-to-r from-[rgba(6,214,160,1)] to-[rgba(64,224,208,1)] hover:from-[rgba(6,214,160,0.9)] hover:to-[rgba(64,224,208,0.9)] text-[rgba(255,255,255,1)] font-semibold">
                            <Link href="/auth?mode=register">Get Started</Link>
                        </Button>

                        <p className="text-base md:text-lg text-[rgba(255,255,255,0.97)] font-medium">
                            Start planning your dream vacation for free. No credit card required.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}