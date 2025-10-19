import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function ChroneySection() {
  const fullResponse = "During Period 3 on Monday, there are 2 teachers free: Ms. Sharma (Math) and Mr. Patel (English).";
  const words = fullResponse.split(" ");
  
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentWordIndex < words.length) {
      // Type next word
      const timeout = setTimeout(() => {
        setDisplayedWords(prev => [...prev, words[currentWordIndex]]);
        setCurrentWordIndex(prev => prev + 1);
      }, 150); // Speed of typing (150ms per word)

      return () => clearTimeout(timeout);
    } else {
      // Animation complete, pause for 2 seconds then restart
      setIsTyping(false);
      const resetTimeout = setTimeout(() => {
        setDisplayedWords([]);
        setCurrentWordIndex(0);
        setIsTyping(true);
      }, 2000); // Pause before restarting

      return () => clearTimeout(resetTimeout);
    }
  }, [currentWordIndex, words]);

  // Format text with bold for "2 teachers"
  const formatText = (text: string) => {
    const parts = text.split("2 teachers");
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <strong>2 teachers</strong>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <section id="chroney" className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Chroney AI Assistant
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-2">
            Always here to help
          </p>
        </div>
        
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl border border-border" data-testid="chroney-chat-demo">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white px-4 py-3 sm:px-6 sm:py-4 rounded-3xl max-w-[85%] sm:max-w-md shadow-lg">
                <p className="text-sm sm:text-base lg:text-lg font-medium">
                  How many teachers are free during Period 3 on Monday?
                </p>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-3 sm:px-6 sm:py-4 rounded-3xl rounded-bl-md max-w-[85%] sm:max-w-md">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FF4D4D] to-[#9333EA] rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground">Chroney AI</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed min-h-[60px] sm:min-h-[80px]">
                  {formatText(displayedWords.join(" "))}
                  {isTyping && (
                    <span className="inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-[#FF4D4D] ml-1 animate-pulse"></span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
