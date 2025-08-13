import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function TestUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult("");

    try {
      console.log("Début upload test...");
      
      // Test avec un nom de fichier simple
      const fileName = `test_${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('public-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Erreur upload:", error);
        setResult(`ERREUR: ${error.message}`);
        return;
      }

      console.log("Upload réussi:", data);
      setResult(`SUCCÈS: ${data.path}`);

    } catch (error: any) {
      console.error("Exception:", error);
      setResult(`EXCEPTION: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-4">Test Upload Simple</h3>
      <Input 
        type="file" 
        onChange={handleTestUpload}
        disabled={uploading}
        accept=".csv,.txt,.pdf"
      />
      {uploading && <p>Upload en cours...</p>}
      {result && (
        <div className={`mt-2 p-2 rounded ${result.startsWith('SUCCÈS') ? 'bg-green-100' : 'bg-red-100'}`}>
          {result}
        </div>
      )}
    </div>
  );
}