import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/chrona-logo-transparent.png";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home page with hash
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    // If on home page, scroll directly to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-shadow duration-200 ${isScrolled ? "shadow-sm" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <img 
                  src={logoUrl}
                  alt=""
                  role="presentation"
                  className="w-16 h-16 -mr-1"
                  width="64"
                  height="64"
                  decoding="async"
                  data-testid="img-logo-header"
                />
                <span className="text-xl font-bold text-foreground">AI Chrona</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("chroney")}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="nav-chroney"
              >
                Chroney AI
              </button>
              <Link 
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="nav-blog"
              >
                Blog
              </Link>
              <Link 
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="nav-contact"
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/contact">
              <Button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                data-testid="button-demo-desktop"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Toggle mobile navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-navigation-menu"
          className="md:hidden bg-background border-t border-border"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection("features")}
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 w-full text-left"
              data-testid="nav-features-mobile"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("chroney")}
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 w-full text-left"
              data-testid="nav-chroney-mobile"
            >
              Chroney AI
            </button>
            <Link 
              href="/blog"
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 w-full text-left"
              data-testid="nav-blog-mobile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/contact"
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 w-full text-left"
              data-testid="nav-contact-mobile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link href="/contact" className="w-full mt-2">
              <Button 
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                data-testid="button-demo-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
