"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SeedPhraseDisplayProps {
  seedPhrase: string;
}

export function SeedPhraseDisplay({ seedPhrase }: SeedPhraseDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showSeed, setShowSeed] = useState(true);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    toast({ title: "Copied!", description: "Seed phrase copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const words = seedPhrase.split(" ");
  const blurredWords = words.map(word => "•".repeat(word.length));

  return (
    <div className="relative rounded-lg border bg-card p-4">
      <div className={`grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-sm ${!showSeed ? "blur-sm" : ""}`}>
        {(showSeed ? words : blurredWords).map((word, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-6 text-right text-muted-foreground">{index + 1}.</span>
            <span>{word}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setShowSeed(s => !s)}>
          {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
