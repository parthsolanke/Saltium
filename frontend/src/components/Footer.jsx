import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Developed with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by{" "}
          <span className="font-medium">Parth Solanke</span>
        </p>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/parthsolanke"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <img 
              src="/github.svg"
              alt="GitHub" 
              className="mr-2 h-4 w-4" 
            />
            GitHub
          </a>
        </Button>
      </div>
    </footer>
  );
}
