
import React, { createContext, useContext, useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabName = 'synth' | 'pieces' | 'chronologie' | 'taches' | 'discussions' | 'rpva' | 'analyse';

interface DossierTabsContextType {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const DossierTabsContext = createContext<DossierTabsContextType>({
  activeTab: 'synth',
  setActiveTab: () => {}
});

export const useDossierTabs = () => useContext(DossierTabsContext);

interface DossierTabsProviderProps {
  children: React.ReactNode;
  defaultTab?: TabName;
}

interface TabPanelProps {
  name: TabName;
  children: React.ReactNode;
}

const TabSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const DossierTabsProvider = ({ children, defaultTab = 'synth' }: DossierTabsProviderProps) => {
  const [activeTab, setActiveTab] = useState<TabName>(defaultTab);

  return (
    <DossierTabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabName)} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="synth">Synthèse</TabsTrigger>
            <TabsTrigger value="pieces">Pièces</TabsTrigger>
            <TabsTrigger value="chronologie">Chronologie</TabsTrigger>
            <TabsTrigger value="taches">Tâches</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="rpva">RPVA</TabsTrigger>
            <TabsTrigger value="analyse">Analyse</TabsTrigger>
          </TabsList>
          
          <Suspense fallback={<TabSpinner />}>
            {children}
          </Suspense>
        </Tabs>
      </div>
    </DossierTabsContext.Provider>
  );
};

export const TabPanel = ({ name, children }: TabPanelProps) => {
  return (
    <TabsContent value={name} className="mt-6">
      {children}
    </TabsContent>
  );
};
