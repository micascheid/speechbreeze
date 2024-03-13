import React, { createContext, useContext, useState, ReactNode } from 'react';

type SelectedLSAContextType=  {
    selectedLsaId: number | null;
    setSelectedLsaId: (id: number | null) => void;
    audioFileUrl: string | null;
    setAudioFileUrl: (url: string) => void;
}

const SelectedLSAContext = createContext<SelectedLSAContextType | undefined>(undefined);

export const useSelectedLSA = () => {
    const context = useContext(SelectedLSAContext);
    if (!context) throw new Error('useSelectedLSA must be used within a SelectedLSAProvider');
    return context;
};

export const SelectedLSAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedLsaId, setSelectedLsaId] = useState<number | null>(null);
    const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
    return (
        <SelectedLSAContext.Provider value={{ selectedLsaId, setSelectedLsaId, audioFileUrl, setAudioFileUrl }}>
            {children}
        </SelectedLSAContext.Provider>
    );
};
