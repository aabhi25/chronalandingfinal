import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
    <section className="relative overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-purple opacity-50 blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24 pb-6 sm:pb-8 lg:pb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 rounded-full gradient-primary">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
            ERP is boring.{" "}
            <span className="bg-gradient-to-r from-[#FF4D4D] to-[#9333EA] bg-clip-text text-transparent">
              Not anymore.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Meet AI Chrona – The world's first AI chat-based school management system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="gradient-primary text-white px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                data-testid="button-book-demo-hero"
              >
                Request Demo
              </Button>
            </Link>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto"
              data-testid="button-watch-video"
              onClick={() => setIsVideoOpen(true)}
            >
              See AI in Action
            </Button>
          </div>
        </div>
      </div>
    </section>

    <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>AI Chrona Demo Video</DialogTitle>
        </DialogHeader>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/HiSF8sr1Jng?autoplay=1"
            title="AI Chrona Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
