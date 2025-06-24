
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useState } from "react";

type Props = {
  trigger: React.ReactNode;
  url: string;
  mime: string;
  name: string;
};

export function FilePreview({ trigger, url, mime, name }: Props) {
  const [open, setOpen] = useState(false);
  const isImg = mime.startsWith("image/");
  const isPdf = mime === "application/pdf";

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-4xl max-h-[90vh]">
          {isImg && (
            <div className="flex justify-center items-center p-4">
              <img 
                src={url} 
                alt={name} 
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          )}
          {isPdf && (
            <iframe 
              src={url} 
              title={name} 
              className="w-full h-[80vh]"
            />
          )}
          {!isImg && !isPdf && (
            <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
              <FileText className="size-12 text-justice-dark mb-4" />
              <p className="text-sm font-medium text-justice-text">{name}</p>
              <p className="text-xs text-gray-500 mt-1">Aperçu non disponible</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
