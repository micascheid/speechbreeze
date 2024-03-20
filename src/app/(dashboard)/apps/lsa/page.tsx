'use client'
import React, {useEffect, useState} from 'react';
import {Box, Button, Card, Grid, Skeleton, Stack, Tab, Tabs, Typography} from '@mui/material';
import MainCard from '@/components/MainCard';
import Transcription from "@/components/lsa/Transcription";
import useUser from "@/hooks/useUser";
import PatientSelector from "@/components/lsa/PatientSelector";
import {SelectedLSAProvider, useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useLsa from "@/hooks/lsa/useLsa";
import AudioRecord from "@/components/audio/AudioRecord";
import AudioPlayer from "@/components/audio/AudioPlayer";
import AudioFinalize from "@/components/audio/AudioFinalize";
import AudioNone from "@/components/audio/AudioNone";
import axios from "axios";
import AudioUpload from "@/components/lsa/AudioUpload";

interface ContentProps {
    audioSelection: "record" | "upload" | "noaudio" | null;
    setAudioSelection: React.Dispatch<React.SetStateAction<"record" | "upload" | "noaudio" | null>>;
}

function Content({audioSelection, setAudioSelection}: ContentProps) {
    const {lsa, isLoading, isError} = useLsa();
    const isDisabled = !lsa;
    const audio_type = lsa?.audio_type;
    const audio_url = lsa?.audiofile_url;
    const [finalize, setFinalize] = useState<boolean>(false);

    const {selectedLsaId, localAudioSource} = useSelectedLSA();

    const uploadAudioBlobUrl = async (blobUrl: string) => {

        // Fetch the blob data from the blob URL
        const response = await fetch(blobUrl);
        const blobData = await response.blob();

        const formData = new FormData();
        formData.append('audio', blobData);

        if (selectedLsaId !== null) {
            formData.append('lsa_id', selectedLsaId.toString());
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        } catch (error: any) {
            console.error("Error uploading audio:", error);

            if (error.response) {
                console.log("Error data", error.response.data);
                console.log("Error status", error.response.status);
                console.log("Error headers", error.response.headers);
            } else if (error.request) {
                console.log("No response received", error.request);
            }
        }
    }

    const uploadAudio = async (file: any) => {
        const formData = new FormData();
        formData.append('audio', file);
        if (selectedLsaId !== null) {
            formData.append('lsa_id', selectedLsaId.toString());
        }
        try {
            const response = await axios.post('http://127.0.0.1:5000/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This header tells the server about the type of the content
                },
            });

        } catch (error: any) {
            console.log("Error message", error.message);
            if (error.response) {
                //The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log("Error data", error.response.data);
                console.log("Error status", error.response.status);
                console.log("Error headers", error.response.headers);
            } else if (error.request) {
                //The request was made but no response was received
                console.log("No response received", error.request);
            }

            console.error("Error uploading audio:", error);
        }
    }
    const finalizeAudio = async () => {
        console.log("audio type", audio_type);
        if (audio_type === 'record') {
            try {
                console.log("uploading blob url");
                await uploadAudioBlobUrl(localAudioSource as string);
            } catch (error) {
                console.log("error uploading recording", error);
            }
        } else if (audio_type === 'upload') {
            try {
                console.log("uploading file url");
                await uploadAudio(localAudioSource as File);
            } catch (error) {
                console.log("error uploading file", error);
            }
        }
        setFinalize(false);

    }

    useEffect(() => {
        if (finalize) {
            console.log("you getting called?");
            finalizeAudio();
        }
    }, [finalize]);


    return (
        <Grid item xs={12}>
            <MainCard title={`Working LSA: ${!lsa?.name ? "Select or Start LSA Above" : lsa.name}`}>
                <Grid container spacing={2}>

                    {!selectedLsaId ? (
                        <Grid item xs={12}>
                            <Skeleton variant={'rectangular'} animation={false} height={200}/>
                        </Grid>
                    ) : (
                        <>
                            {audio_url ? (
                                <Grid item xs={12}>
                                    <AudioPlayer/>
                                </Grid>

                            ) : audio_type === 'record' ? (
                                <Grid item xs={12}>
                                    <AudioRecord/>
                                    <AudioFinalize setFinalize={setFinalize} disabled={!localAudioSource}/>
                                </Grid>
                            ) : audio_type === 'upload' ? (
                                <Grid item xs={12}>
                                    <AudioUpload />
                                    <AudioFinalize setFinalize={setFinalize} disabled={!localAudioSource}/>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <AudioNone/>
                                </Grid>
                            )}

                        </>
                    )}

                </Grid>
            </MainCard>
        </Grid>
    )
}

export default function LsaTool() {
    const user = useUser();
    const [audioSelection, setAudioSelection] = useState<"record" | "upload" | "noaudio" | null>(null);

    return (
        <SelectedLSAProvider>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MainCard title={"Patient Management"}>
                        <PatientSelector/>
                    </MainCard>
                </Grid>
                <Content audioSelection={audioSelection} setAudioSelection={setAudioSelection}/>
            </Grid>

        </SelectedLSAProvider>
    );
}
