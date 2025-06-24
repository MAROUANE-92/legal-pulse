
import { useIngest } from "@/lib/IngestStore";
import { Upload } from "lucide-react";
import { useState, useRef } from "react";

export function UploadZone() {
  const { upload } = useIngest();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    Array.from(e.dataTransfer.files).forEach(upload);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(upload);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-dashed border-2 rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-primary hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg font-medium text-gray-900 mb-2">
        Glissez vos fichiers ici
      </p>
      <p className="text-sm text-gray-500">
        ou cliquez pour sélectionner
      </p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.pst,.eml,.jpg,.jpeg,.png"
      />
    </div>
  );
}
