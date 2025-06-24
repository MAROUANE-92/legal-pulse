
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = { 
  text: string;
};

export function HelpTooltip({ text }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-4 inline-block text-justice-primary ml-1 cursor-pointer hover:text-justice-dark transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm leading-snug">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
