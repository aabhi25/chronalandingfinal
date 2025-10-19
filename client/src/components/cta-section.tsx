import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative bg-white overflow-hidden">
      {/* Faded purple-pink gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-50/30 to-blue-100/40"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
          AI Chrona brings everything your school needs – from classroom to cloud – in one intelligent platform.
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10">
          Join hundreds of schools already transforming their management with AI.
        </p>
        
        <Link href="/contact">
          <Button 
            size="lg"
            className="gradient-primary text-white px-8 sm:px-10 py-5 sm:py-6 rounded-full text-base sm:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            data-testid="button-book-demo-cta"
          >
            Request a Demo
          </Button>
        </Link>
      </div>
    </section>
  );
}
