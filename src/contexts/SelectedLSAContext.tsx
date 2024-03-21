import React, {createContext, useContext, useState, ReactNode} from 'react';
import {string} from "yup";

type SelectedLSAContextType = {
    selectedLsaId: number | null;
    setSelectedLsaId: (id: number | null) => void;
    audioFileUrl: string | null;
    setAudioFileUrl: (url: string) => void;
    localAudioSource: File | string | null;
    setLocalAudioSource: (source: File | string | null) => void;
    resetLsa: () => void;
}


const SelectedLSAContext = createContext<SelectedLSAContextType | undefined>(undefined);

export const useSelectedLSA = () => {
    const context = useContext(SelectedLSAContext);
    if (!context) throw new Error('useSelectedLSA must be used within a SelectedLSAProvider');
    return context;
};

export const SelectedLSAProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [selectedLsaId, setSelectedLsaId] = useState<number | null>(null);
    const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
    const [localAudioSource, setLocalAudioSource] = useState<File | string | null>(null);

    const resetLsa = () => {
        setSelectedLsaId(null);
        setAudioFileUrl(null);
        setLocalAudioSource(null);
    };

    return (
        <SelectedLSAContext.Provider
            value={{
                selectedLsaId,
                setSelectedLsaId,
                audioFileUrl,
                setAudioFileUrl,
                localAudioSource,
                setLocalAudioSource,
                resetLsa
            }}>
            {children}
        </SelectedLSAContext.Provider>
    );
};
