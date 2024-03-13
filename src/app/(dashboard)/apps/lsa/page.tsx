'use client'
import {useEffect, useState} from 'react';
import {Button, Card, Grid, Stack, Typography} from '@mui/material';
import MainCard from '@/components/MainCard';
import axios from 'axios';
import useSWR from 'swr';
import useMLU from "@/hooks/lsa/useMLU";
import AudioChoice from "@/components/lsa/AudioChoice";
import Transcription from "@/components/lsa/Transcription";
import useUser from "@/hooks/useUser";
import AudioPlayer from "@/components/AudioPlayer";
import PatientSelector from "@/components/lsa/PatientSelector";
import {SelectedLSAProvider, useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useLsas from "@/hooks/lsa/useLsas";
import useLsa from "@/hooks/lsa/useLsa";



function Content() {
    const { lsa, isLoading, isError } = useLsa();



    return (
        <Grid item xs={12}>
            <MainCard title={`Working LSA: ${!lsa?.name ? "Select or Start LSA Above" : lsa.name}`}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <AudioChoice/>
                    </Grid>
                    <Grid item xs={12}>
                        <AudioPlayer/>
                    </Grid>
                    <Grid item xs={12}>
                        <Transcription/>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    )
}
export default function LsaTool() {
    const user = useUser();

    return (
        <SelectedLSAProvider>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MainCard title={"Patient Management"}>
                        <PatientSelector/>
                    </MainCard>
                </Grid>
                <Content />
            </Grid>

        </SelectedLSAProvider>
    );
}
