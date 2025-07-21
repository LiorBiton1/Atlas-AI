import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[rgba(135,206,235,0.1)] to-[rgba(246,232,195,0.2)]">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-[rgba(255,104,104,0.1)] text-[rgba(255,104,104,1)] border-[rgba(255,104,104,0.2)]">
                    Testimonials
                  </Badge>

                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[rgba(2,48,71,1)]">
                    Loved by travelers worldwide
                  </h2>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[rgba(255,255,255,1)]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {["star1", "star2", "star3", "star4", "star5"].map((starId) => (
                        <Star key={starId} className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                      ))}
                    </div>

                    <p className="text-[rgba(2,48,71,0.7)] mb-4">
                      &quot;atlasAI planned the most incredible beach-hopping adventure in Thailand. Every sunset was perfect!&quot;
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold">
                        S
                      </div>

                      <div>
                        <p className="font-medium text-[rgba(2,48,71,1)]">Sarah Johnson</p>
                        <p className="text-sm text-[rgba(2,48,71,0.6)]">Travel Blogger</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[rgba(255,255,255,1)]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {['star1', 'star2', 'star3', 'star4', 'star5'].map((starId) => (
                        <Star key={starId} className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                      ))}
                    </div>

                    <p className="text-[rgba(2,48,71,0.7)] mb-4">
                      &quot;Found the most amazing hidden hot springs in Iceland thanks to atlasAI. Pure vacation magic!&quot;
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold">
                        M
                      </div>

                      <div>
                        <p className="font-medium text-[rgba(2,48,71,1)]">Mike Chen</p>
                        <p className="text-sm text-[rgba(2,48,71,0.6)]">Adventure Seeker</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[rgba(255,255,255,1)]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {['star1', 'star2', 'star3', 'star4', 'star5'].map((starId) => (
                        <Star key={starId} className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                      ))}
                    </div>

                    <p className="text-[rgba(2,48,71,0.7)] mb-4">
                      &quot;Our family beach vacation in Bali was flawless. The kids are still talking about the snorkeling
                      spots!&quot;
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[rgba(6,214,160,1)] to-[rgba(64,224,208,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold">
                        E
                      </div>
                      
                      <div>
                        <p className="font-medium text-[rgba(2,48,71,1)]">Emily Rodriguez</p>
                        <p className="text-sm text-[rgba(2,48,71,0.6)]">Family Traveler</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
    )
}