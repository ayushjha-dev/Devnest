import { useState, useEffect } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import quotesData from "@/data/quotes.json";
import DecryptedText from "@/components/DecryptedText";

interface Quote {
  text: string;
  author: string;
  category: string;
}

export function DailyQuote() {
  const quotes: Quote[] = quotesData.quotes;
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteKey, setQuoteKey] = useState(0);

  useEffect(() => {
    // Get a random quote on component mount
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }
  }, [quotes]);

  const getNewQuote = () => {
    if (quotes.length > 0) {
      let randomIndex = Math.floor(Math.random() * quotes.length);
      // Ensure we get a different quote
      const currentIndex = quotes.findIndex(q => q.text === currentQuote?.text);
      if (quotes.length > 1 && randomIndex === currentIndex) {
        randomIndex = (randomIndex + 1) % quotes.length;
      }
      setCurrentQuote(quotes[randomIndex]);
      setQuoteKey(prev => prev + 1);
    }
  };

  if (!currentQuote) return null;

  return (
    <section className="relative py-12 glass-effect rounded-2xl overflow-hidden border border-border">
      {/* Removed animated background - using global background from Layout */}

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <Lightbulb className="w-8 h-8 text-primary mx-auto mb-4" />
        <div className="text-lg sm:text-2xl italic text-foreground font-semibold mb-4 leading-relaxed">
          <DecryptedText
            key={quoteKey}
            text={`"${currentQuote.text}"`}
            animateOn="view"
            speed={30}
            maxIterations={15}
            className="inline-block"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          — {currentQuote.author} • {currentQuote.category}
        </p>
        <Button
          onClick={getNewQuote}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Quote
        </Button>
      </div>

      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
