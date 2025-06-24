
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type PieceRaw = {
  id: string;
  name: string;
  size: number;
  mime: string;
  status: "uploaded" | "processing" | "classified";
  aiType?: string;
  confidence?: number;
};

interface IngestContextType {
  pieces: PieceRaw[];
  upload: (file: File) => void;
}

const StoreCtx = createContext<IngestContextType | null>(null);

function useProvider(): IngestContextType {
  const [pieces, setPieces] = useState<PieceRaw[]>([]);

  /* 1) Upload (creates PieceRaw) */
  const upload = useCallback((file: File) => {
    const id = crypto.randomUUID();
    setPieces((p) => [
      ...p,
      {
        id,
        name: file.name,
        size: file.size,
        mime: file.type || "application/octet-stream",
        status: "uploaded",
      },
    ]);

    /* 2) Fake worker */
    setPieces((p) =>
      p.map((x) => (x.id === id ? { ...x, status: "processing" } : x))
    );
    
    setTimeout(() => {
      const guess =
        file.type.startsWith("image")
          ? "Scan"
          : file.name.match(/\.(csv|xls|xlsx)$/i) ? "Badge logs"
          : file.name.match(/\.(pst|eml)$/i) ? "Courriel"
          : file.name.match(/\.(pdf)$/i) ? "Document PDF"
          : "Document";
      
      setPieces((p) =>
        p.map((x) =>
          x.id === id
            ? {
                ...x,
                status: "classified",
                aiType: guess,
                confidence: Math.round((0.7 + Math.random() * 0.3) * 100) / 100, // 70-100%
              }
            : x
        )
      );
    }, 2500 + Math.random() * 2000); // 2–4 s
  }, []);

  return { pieces, upload };
}

interface IngestProviderProps {
  children: ReactNode;
}

export function IngestProvider({ children }: IngestProviderProps) {
  const value = useProvider();
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useIngest = (): IngestContextType => {
  const context = useContext(StoreCtx);
  if (!context) {
    throw new Error('useIngest must be used within an IngestProvider');
  }
  return context;
};
