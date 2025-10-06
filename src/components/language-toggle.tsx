import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('cs')}
          className={language === 'cs' ? 'bg-accent/10' : ''}
        >
          Čeština
        </DropdownMenuItem>
         <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-accent/10' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
