import { Mail, Linkedin, Youtube } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/chrona-logo-transparent.png";

export default function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12">
          <div className="mb-6 sm:mb-8 md:mb-0">
            <Link to="/">
              <div className="flex items-center mb-3 sm:mb-4 cursor-pointer hover:opacity-80 transition-opacity gap-2 sm:gap-3">
                <img 
                  src={logoUrl}
                  alt=""
                  role="presentation"
                  className="w-14 h-14 sm:w-16 sm:h-16"
                  width="64"
                  height="64"
                  loading="lazy"
                  decoding="async"
                  data-testid="img-logo-footer"
                />
                <span className="text-xl sm:text-2xl font-bold">AI Chrona</span>
              </div>
            </Link>
            <p className="text-base sm:text-lg font-medium opacity-90">
              Where AI Runs the School.
            </p>
          </div>
          
          <div className="flex space-x-5 sm:space-x-6">
            <a 
              href="https://www.linkedin.com/company/aichrona"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="https://www.youtube.com/@AIChrona"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a 
              href="mailto:hello@chrona.in"
              className="hover:opacity-70 transition-opacity"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-sm opacity-75" data-testid="text-copyright">
            © 2024 AI Chrona. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
