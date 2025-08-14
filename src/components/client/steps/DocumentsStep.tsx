import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useStepper } from '../NewStepperProvider';

interface BordereauEntry {
  category: string;
  number: number;
  title: string;
  file: File;
}

export function DocumentsStep() {
  const { formData, savePartial, goTo } = useStepper();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(
    formData.documents?.files || {}
  );
  const [bordereau, setBordereau] = useState<BordereauEntry[]>(
    formData.documents?.bordereau || []
  );

  const categories = [
    { id: 'A', name: 'Contrat', range: '1-20', color: 'bg-blue-100 text-blue-700' },
    { id: 'B', name: 'Litige', range: '21-40', color: 'bg-orange-100 text-orange-700' },
    { id: 'C', name: 'Preuves', range: '41-60', color: 'bg-green-100 text-green-700' },
    { id: 'D', name: 'Contexte', range: '61-80', color: 'bg-purple-100 text-purple-700' }
  ];

  const handleFileDrop = (categoryId: string, files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFiles(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), ...newFiles]
    }));

    // Générer entrées bordereau
    const startNumber = getCategoryStartNumber(categoryId);
    const newBordereau = newFiles.map((file, index) => ({
      category: categoryId,
      number: startNumber + (uploadedFiles[categoryId]?.length || 0) + index,
      title: file.name,
      file: file
    }));

    setBordereau(prev => [...prev, ...newBordereau]);
  };

  const getCategoryStartNumber = (categoryId: string) => {
    switch(categoryId) {
      case 'A': return 1;
      case 'B': return 21;
      case 'C': return 41;
      case 'D': return 61;
      default: return 1;
    }
  };

  const handleSubmit = () => {
    savePartial('documents', { files: uploadedFiles, bordereau });
    goTo('timeline');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de vos documents</CardTitle>
        <CardDescription>
          Glissez vos fichiers dans les zones correspondantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileDrop(category.id, e.dataTransfer.files);
              }}
            >
              <div className="mb-2">
                <Badge className={category.color}>
                  Zone {category.id}
                </Badge>
              </div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-xs text-muted-foreground">Pièces {category.range}</p>
              
              <input
                type="file"
                multiple
                className="hidden"
                id={`file-${category.id}`}
                onChange={(e) => e.target.files && handleFileDrop(category.id, e.target.files)}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => document.getElementById(`file-${category.id}`)?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Sélectionner
              </Button>

              {uploadedFiles[category.id]?.length > 0 && (
                <div className="mt-3 text-xs text-left space-y-1">
                  {uploadedFiles[category.id].map((file, idx) => (
                    <div key={idx} className="truncate text-green-600">
                      ✓ {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bordereau en temps réel */}
        {bordereau.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Bordereau de pièces</h3>
            <div className="space-y-1 text-sm">
              {categories.map(cat => {
                const catDocs = bordereau.filter(b => b.category === cat.id);
                if (catDocs.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <div className="font-medium mt-2">{cat.id}. {cat.name}</div>
                    {catDocs.map(doc => (
                      <div key={doc.number} className="ml-4 text-muted-foreground">
                        Pièce {doc.number} : {doc.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full mt-6">
          Continuer vers la chronologie
        </Button>
      </CardContent>
    </Card>
  );
}